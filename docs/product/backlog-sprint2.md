# Product Backlog — Sprint 2 (7–13 julio 2026)

Ítems que no estaban en la Primera Entrega y que corresponden al Sprint 2, según
el cronograma del taller ("Integración LLM / optimización / IA responsable /
despliegue / pruebas automatizadas"). Continúa la numeración del backlog existente
(PB-01 … PB-11), por lo que estos ítems arrancan en **PB-12**.

Responsable: Michael Ramírez (Product Owner).
Última actualización: 6 de julio de 2026.

Prioridad: Alta / Media / Baja. Estimación en puntos de historia (1, 2, 3, 5, 8).

| ID | Ítem | Épica | Prioridad | Estimación | Responsable |
|----|------|-------|-----------|------------|-------------|
| PB-12 | Análisis de privacidad de las imágenes: qué datos se capturan, dónde se almacenan y a qué terceros se envían. | IA responsable | Alta | 3 | Michael |
| PB-13 | Análisis de sesgos del reconocimiento (idioma, tipo de notación, letra manuscrita) y mitigaciones documentadas. | IA responsable | Alta | 3 | Michael |
| PB-14 | Instrumentar métrica de latencia por etapa del pipeline (visión, LLM, resolución). | Métricas | Alta | 3 | Daniel + Adrián |
| PB-15 | Instrumentar uso de CPU y memoria del backend durante la inferencia. | Métricas | Media | 2 | Adrián |
| PB-16 | Registrar costo por llamada a las APIs externas (tokens / peticiones) y estimación mensual. | Métricas | Media | 3 | Daniel |
| PB-17 | Despliegue del backend en la nube (Render o Railway) con variables de entorno seguras. | Despliegue | Alta | 5 | Daniel + Adrián |
| PB-18 | Despliegue del frontend (build Vite + Nginx) conectado al backend desplegado. | Despliegue | Alta | 3 | Alejandra + Daniel |
| PB-19 | Mockups / prototipo de UI de la pantalla principal y del flujo de resolución (wireframe o Figma). | Diseño UX | Media | 3 | Alejandra + Michael |
| PB-20 | Flujo de "Resolver y explicar": botón que conecta `solve()` + `SolutionSteps` en `HomePage`. | Frontend | Alta | 3 | Alejandra |
| PB-21 | Llegar a ≥ 50% de cobertura de pruebas en backend y ampliar la suite de frontend. | Calidad | Alta | 5 | Juan Fernando |

## Notas

- Los ítems de **IA responsable** (PB-12, PB-13) se apoyan en los riesgos R-09 y
  R-10 descritos en [`riesgos.md`](./riesgos.md).
- Los ítems de **métricas** (PB-14 a PB-16) son insumo para la sección de
  optimización de inferencia que pide el taller para esta semana.
- PB-20 (flujo de resolución) es la contraparte funcional de `SolutionSteps.tsx`,
  que ya existe en el código pero aún no está conectado en `HomePage`.
