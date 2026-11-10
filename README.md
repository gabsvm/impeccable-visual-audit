# Impeccable Visual Audit Skill

Skill de auditoría visual con puerta de aprobación obligatoria de imagen **Antes vs Después** antes de permitir que un agente de IA modifique código fuente.

## ¿Qué contiene?
- \SKILL.md\: Protocolo estricto paso a paso para el agente (captura antes -> análisis impeccable -> renderizado lado a lado de cambios propuestos -> parada para esperar aprobación explícita del usuario -> implementación tras aprobación).
- \gents/openai.yaml\: Configuración y metadatos para entornos compatibles con OpenAI / ChatGPT Codex.
- \scripts/render_before_after_template.mjs\: Script auxiliar para componer o previsualizar comparativas visuales.

## Instalación en otra PC

Clona el repositorio en la carpeta de skills del agente o harness que utilices:

### 1. Claude / Claude Code
\\\ash
git clone https://github.com/gabsvm/impeccable-visual-audit.git ~/.claude/skills/impeccable-visual-audit
\\\

### 2. OpenAI / ChatGPT Codex
\\\ash
git clone https://github.com/gabsvm/impeccable-visual-audit.git ~/.codex/skills/impeccable-visual-audit
\\\

### 3. Gemini / Antigravity
\\\ash
git clone https://github.com/gabsvm/impeccable-visual-audit.git ~/.gemini/config/skills/impeccable-visual-audit
\\\

*(En Windows, \~/\ equivale a \C:\Users\<TuUsuario>\)*.

## Cómo invocarla
Pídele a cualquier agente en tu prompt:
> *\"Usa la skill impeccable-visual-audit para revisar la pantalla de [Nombre] y entrégame la comparativa antes/después para que te dé mi aprobación antes de modificar código.\"*