---
name: skills-publisher
description: "Publica skills en la biblioteca de OscarCode9 (oscarcode9.github.io/skills.html). Un comando: empaqueta el zip, calcula sha256, actualiza el index.json, sube al S3 (oscarcode9-skills), audita que no haya datos sensibles y verifica el sitio. Úsala SIEMPRE que el usuario pida 'subir/publicar una skill' o actualizar la biblioteca de skills."
metadata:
  author: OscarCode9
  version: "1.0.0"
---

# Skills Publisher — publica skills en un comando

Publica o actualiza una skill en la biblioteca pública
`https://oscarcode9.github.io/skills.html`.

## Cómo funciona la biblioteca

- **Index**: `https://oscarcode9-skills.s3.us-east-2.amazonaws.com/index.json` (JSON con
  `name`, `slug`, `area`, `description`/`description_es`, `sizeBytes`, `sizeHuman`,
  `sha256`, `fileCount`, `downloadUrl`, `readme`).
- **Zips**: `https://oscarcode9-skills.s3.us-east-2.amazonaws.com/skills/<area>/<name>.zip`.
- **Fuentes del sitio**: el sitio carga el S3 PRIMERO y la API `vida.oventlabs.net` como
  respaldo (ya arreglado — no tocar el orden en skills.html).
- **CORS**: el bucket ya permite GET desde cualquier origen (configurado).
- Credenciales AWS: profile default del CLI de AWS (ya configurado en la máquina).

## Publicar una skill

```bash
~/.agents/skills/skills-publisher/scripts/publish.sh \
  /ruta/a/mi-skill          # carpeta con SKILL.md dentro
  backend-nodejs            # área (default: backend-nodejs)
```

Áreas existentes: `ai-agentes-tools`, `backend-nodejs`, `databases`, `devops-deploy`,
`documentos-reportes`, `email-comunicaciones`, `frontend-ui-ux`, `legal-contratos`,
`media-contenido`.

## Qué hace el script (paso a paso)

1. Valida que exista `SKILL.md` con frontmatter (`name`, `description`).
2. **Audita sanitización**: busca keys (sk_/pk_/whsec_/AKIA/ghp_), passwords conocidas,
   emails personales, IPs, paths locales, nombres de usuario de servidores y dominios internos.
   → advertencias si encuentra algo (no bloquea, pero las muestra al final).
3. Empaqueta `zip` (carpeta `<skill>/SKILL.md`) y calcula `sha256`, tamaño y fileCount.
4. Descarga el `index.json` actual del S3 (para no pisar otras skills).
5. Agrega o actualiza la entrada (descripción es/en desde el frontmatter, readme = SKILL.md).
6. Sube el zip y el index.json al S3.
7. Verifica el index publicado y reporta.

## Reglas

- SIEMPRE correr la auditoría de sanitización antes de publicar: una skill pública jamás
  lleva claves, IPs, passwords, emails personales ni paths del servidor.
- Si la skill cambió, re-publicarla con el mismo comando (el script hace upsert por slug).
- Si el sitio no muestra la skill: verificar que el S3 responda (CORS ya está) y que el
  index tenga `updatedAt` nuevo. No modificar `API_URLS` de skills.html salvo que el S3
  deje de ser la primera fuente.
- El zip debe contener la carpeta `<nombre>/SKILL.md` (formato skills.sh).
- Verificación manual final: `https://oscarcode9.github.io/skills.html` → buscar el slug.
