---
applyTo: '**/post/**'
---

# Instrucciones para el Blog Cronológico (10K Hours Tracker)

## Antes de agregar una nueva entrada

### 1. Obtener la hora exacta
**IMPORTANTE:** Antes de crear una nueva entrada, ejecutar en terminal:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

Esto devuelve la hora en formato ISO 8601 UTC, que es el formato usado en los timestamps del JSON.

### 2. Estructura del archivo de entradas
Las entradas se almacenan en: `post/10k-hours-tracker-entries.json`

Cada entrada debe tener:
- `id`: Número secuencial (siguiente al último)
- `timestamp`: Hora exacta en formato ISO 8601 UTC (obtenida del comando anterior)
- `title`: Título descriptivo corto de la entrada
- `text`: Contenido completo de la entrada

### 3. Flujo de trabajo
1. Ejecutar `date -u +"%Y-%m-%dT%H:%M:%SZ"` para obtener timestamp exacto
2. Leer el JSON actual para ver el último ID
3. Agregar la nueva entrada con el ID siguiente y el timestamp obtenido
4. Redactar/limpiar el texto si viene de audio (corregir gramática, puntuación)
5. Crear un título descriptivo basado en el contenido
6. Hacer commit con mensaje: `feat: Entrada #N - [Título breve]`
7. Push a Git

### 4. Convenciones de redacción
- Mantener el tono personal y auténtico del autor
- Corregir errores gramaticales obvios
- Agregar puntuación correcta
- Separar párrafos con `\n\n` en el JSON
- NO cambiar el significado o estilo del contenido original

### 5. Archivos relacionados
- `post/10k-hours-tracker-entries.json` - Entradas del blog (JSON modular)
- `10k-hours-tracker.html` - Página que renderiza las entradas
- `index.html` - Contiene el enlace al post en la sección Blog
