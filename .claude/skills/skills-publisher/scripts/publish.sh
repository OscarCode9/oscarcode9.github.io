#!/usr/bin/env bash
# Publica una skill en la biblioteca oscarcode9.github.io/skills.html
# Uso: publish.sh <carpeta-de-la-skill> [area]
set -euo pipefail

SKILL_DIR="${1:?Uso: publish.sh <carpeta-de-la-skill> [area]}"
AREA="${2:-backend-nodejs}"
BUCKET="oscarcode9-skills"
INDEX_URL="https://oscarcode9-skills.s3.us-east-2.amazonaws.com/index.json"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

SKILL_MD="$SKILL_DIR/SKILL.md"
[ -f "$SKILL_MD" ] || { echo "❌ No existe SKILL.md en $SKILL_DIR"; exit 1; }

NAME="$(awk -F': ' '/^name:/{print $2; exit}' "$SKILL_MD" | tr -d '"' | xargs)"
[ -n "$NAME" ] || { echo "❌ frontmatter sin 'name:'"; exit 1; }
echo "📦 Publicando skill: $NAME (área: $AREA)"

# ── 1. Auditoría de sanitización ─────────────────────────────────────────────
echo "🔍 Auditando datos sensibles…"
VIOLACIONES=$(grep -noE 'sk_(live|test)_[A-Za-z0-9]{8,}|pk_(live|test)_[A-Za-z0-9]{8,}|whsec_[A-Za-z0-9]+|AKIA[A-Z0-9]{16}|gh[pousr]_[A-Za-z0-9]+|postgres123|T3nK_Pr0d|TestPass|[a-z0-9._%+-]+@(gmail|corporativotruckdriver|hotmail|outlook)\.(com|mx)|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|ec2-user|jorgeluis|/Users/|~/.aws|truck\.pem|herokuapp|oventlabs-api-' "$SKILL_MD" || true)
  # Las URLs públicas del propio proyecto no son secretos
  VIOLACIONES=$(echo "$VIOLACIONES" | grep -vE 'oscarcode9\.github\.io|oscarcode9-skills\.s3' || true)
if [ -n "$VIOLACIONES" ]; then
  echo "⚠️  POSIBLES DATOS SENSIBLES ENCONTRADOS:"
  echo "$VIOLACIONES" | sed 's/^/    /'
  read -r -p "¿Continuar de todos modos? [s/N] " resp
  [[ "$resp" =~ ^[sS]$ ]] || { echo "Abortado."; exit 1; }
else
  echo "✅ Sanitizado"
fi

# ── 2. Empaquetar ────────────────────────────────────────────────────────────
cd "$(dirname "$SKILL_DIR")"
ZIP="$WORK/$NAME.zip"
zip -qr "$ZIP" "$(basename "$SKILL_DIR")"
SHA="$(shasum -a 256 "$ZIP" | awk '{print $1}')"
SIZE="$(stat -f%z "$ZIP" 2>/dev/null || stat -c%s "$ZIP")"
SIZEH="$(echo "$SIZE" | awk '{printf "%.1f KB", $1/1024}')"
FILES="$(unzip -l "$ZIP" | tail -1 | awk '{print $2}')"
echo "📄 zip: $SIZEH · sha: ${SHA:0:12} · $FILES archivos"

# ── 3. Actualizar index.json ─────────────────────────────────────────────────
curl -s -m 15 "$INDEX_URL" -o "$WORK/index.json"
python3 - "$WORK" "$NAME" "$AREA" "$SKILL_MD" "$SHA" "$SIZE" "$SIZEH" "$FILES" <<'PYEOF'
import json, sys, datetime, re

work, name, area, skill_md, sha, size, sizeh, files = sys.argv[1:]
size = int(size)
readme = open(skill_md).read()

# descripción del frontmatter
m = re.search(r'^description:\s*"?(.+?)"?\s*$', readme, re.M)
desc = m.group(1).strip().rstrip('"') if m else name

d = json.load(open(f'{work}/index.json'))
entry = {
    "name": name,
    "slug": name,
    "area": area,
    "description": desc,
    "description_es": desc,
    "sizeBytes": size,
    "sizeHuman": sizeh,
    "sha256": sha,
    "fileCount": int(files),
    "downloadUrl": f"https://oscarcode9-skills.s3.us-east-2.amazonaws.com/skills/{area}/{name}.zip",
    "readme": readme,
}
d['skills'] = [s for s in d['skills'] if s['slug'] != name]
d['skills'].append(entry)
d['skills'].sort(key=lambda s: s['slug'])
d['count'] = len(d['skills'])
d['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
json.dump(d, open(f'{work}/index.json', 'w'), ensure_ascii=False, indent=2)
print(f"📝 index actualizado: {d['count']} skills")
PYEOF

# ── 4. Subir al S3 ───────────────────────────────────────────────────────────
aws s3 cp "$ZIP" "s3://$BUCKET/skills/$AREA/$NAME.zip" --quiet
aws s3 cp "$WORK/index.json" "s3://$BUCKET/index.json" --quiet
echo "☁️  Subido a S3"

# ── 5. Verificar (S3 es eventualmente consistente: reintentar) ──────────────
sleep 2
for i in 1 2 3; do
  curl -s -m 15 "$INDEX_URL" -o "$WORK/verify.json" && [ -s "$WORK/verify.json" ] && break
  echo "   reintentando verificación ($i/3)…"; sleep 2
done
python3 -c "
import json, sys
name = sys.argv[1]
d = json.load(open(sys.argv[2]))
s = [x for x in d['skills'] if x['slug'] == name]
if s:
    print(f\"✅ Verificado en S3: {s[0]['name']} · {s[0]['sizeHuman']} · sha {s[0]['sha256'][:12]}\")
    print('   → https://oscarcode9.github.io/skills.html')
else:
    print('❌ No aparece en el index publicado'); sys.exit(1)
" "$NAME" "$WORK/verify.json"
