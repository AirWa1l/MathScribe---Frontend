# Riesgos del proyecto — MathScribe

Documento de riesgos de la fase de inicio (Sprint 1). Complementa el documento de
elección y aprobación del problema. Cada riesgo indica su **probabilidad** e
**impacto** aproximados (Alto / Medio / Bajo) y una **mitigación** de una línea.

Responsable: Michael Ramírez (Product Owner).
Última actualización: 6 de julio de 2026.

## 1. Riesgos técnicos

| ID | Riesgo | Prob. | Impacto | Mitigación |
|----|--------|-------|---------|------------|
| R-01 | Errores de reconocimiento OCR en letra manuscrita o fotos de baja calidad. | Alta | Alto | Paso de preprocesamiento open source (OpenCV) antes del LLM y permitir reintentar o editar el LaTeX reconocido. |
| R-02 | Dependencia de APIs externas de pago (Gemini, GPT-4V, Mathpix) para el reconocimiento. | Media | Alto | Interfaz `RecognitionProvider` desacoplada que permite cambiar de proveedor; definir un proveedor por defecto y uno de respaldo. |
| R-03 | Límites de cuota o costo si el uso crece por encima de lo previsto. | Media | Medio | Instrumentar métricas de costo por llamada (Sprint 2) y fijar límites/alertas de uso por API key. |
| R-04 | Fallos de compatibilidad de la cámara entre navegadores/dispositivos (permisos, HTTPS, formatos). | Media | Medio | `getUserMedia` con manejo de permiso denegado y `ImageUploader` siempre disponible como alternativa. |
| R-05 | Latencia alta del pipeline (visión + LLM) que degrade la experiencia. | Media | Medio | Medir latencia por etapa (Sprint 2) y mostrar estados de carga claros; optimizar el tamaño de la imagen antes de enviarla. |

## 2. Riesgos de alcance y tiempo

| ID | Riesgo | Prob. | Impacto | Mitigación |
|----|--------|-------|---------|------------|
| R-06 | Equipo de 5 personas cuando el taller sugiere equipos de 3; riesgo de que se perciba reparto desigual. | Baja | Medio | Ver nota de distribución de roles abajo; trazabilidad por rama/PR y por autor deja evidencia de participación de todos. |
| R-07 | Funcionalidades pesadas (integración real de LLM, SymPy, auth) concentradas en Sprint 2. | Media | Alto | El propio cronograma del taller agenda esas piezas para el 7–13 de julio; backlog de Sprint 2 ya priorizado y asignado. |
| R-08 | Acoplamiento entre frontend y backend si el contrato de la API cambia. | Media | Medio | Tipos espejo en `src/types/` y un único cliente HTTP (`services/api.ts`) como puerta al backend. |

### Nota sobre la distribución de roles (R-06)

El taller sugiere seis roles (backend, frontend, visión computacional, integración
multimodal, DevOps/cloud y gestión Scrum) para equipos de tres. Nuestro equipo de
cinco los reparte así, de forma intencional:

- **José Adrián Marín** — Backend + integración multimodal (visión → LLM).
- **María Alejandra Moya** — Frontend.
- **Michael Ramírez** — Product Owner (producto, riesgos, IA responsable).
- **Juan Fernando Calle** — QA y pruebas automatizadas.
- **Daniel Rojas Barreneche** — Scrum Master + DevOps/cloud (CI/CD, despliegue).

La visión computacional open source (OpenCV) la asume Backend como parte del
pipeline. Cada rol tiene ramas y PRs propios, lo que deja evidencia de que todos
participan activamente.

## 3. Riesgos de datos y privacidad

| ID | Riesgo | Prob. | Impacto | Mitigación |
|----|--------|-------|---------|------------|
| R-09 | Las fotos de cuadernos o exámenes pueden contener información personal (nombres, datos del estudiante). | Media | Alto | No persistir imágenes más allá de lo necesario; documentar el tratamiento en la sección de IA responsable (Sprint 2). |
| R-10 | Envío de imágenes a proveedores externos implica compartir datos con terceros. | Media | Alto | Informar al usuario qué se envía y a quién; evaluar recorte/anonimización de la región de interés antes de enviar. |
| R-11 | Exposición accidental de credenciales de las APIs en el repositorio. | Baja | Alto | Uso de `.env.example` sin valores reales; secretos solo en variables de entorno / GitHub Secrets. |

> Los riesgos R-09 y R-10 alimentan directamente la sección de **IA responsable**
> (privacidad, sesgos y mitigaciones) planificada para Sprint 2.
