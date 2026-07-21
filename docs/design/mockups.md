# Mockups y diseño de la interfaz

**Responsable:** María Alejandra Moya (Frontend)
**Versión:** 1.0 — 21 de julio de 2026

Documenta la interfaz de MathScribe: estructura de pantalla, estados y
decisiones de diseño. Los wireframes describen la interfaz **tal como está
construida y desplegada**; no son prototipos previos.

---

## 1. Principio de diseño

Una sola pantalla, sin navegación. El usuario llega con un ejercicio que no
entiende y la interfaz no debe interponer nada entre él y la respuesta. Todo
ocurre en una columna vertical que sigue el orden natural de la tarea:

```
capturar  →  verificar  →  resolver  →  entender
```

Cada sección aparece **sólo cuando la anterior produjo resultado**, de modo que
la pantalla inicial es mínima y va creciendo con el progreso.

## 2. Pantalla principal — estado inicial

```
┌───────────────────────────────────────────────┐
│                     ┌───┐                     │
│                     │ ∑ │                     │
│                     └───┘                     │
│                  MathScribe                   │
│   Digitaliza contenido matemático a LaTeX     │
│          y resuélvelo paso a paso.            │
│                                               │
├───────────────────────────────────────────────┤
│  CAPTURA TU PROBLEMA                          │
│                                               │
│  ┌─────────────────┐  ┌─────────────────┐    │
│  │       ↑         │  │      📷         │    │
│  │                 │  │                 │    │
│  │ Subir una imagen│  │  Usar la cámara │    │
│  └─────────────────┘  └─────────────────┘    │
├───────────────────────────────────────────────┤
│  + MÉTRICAS TÉCNICAS                          │
└───────────────────────────────────────────────┘
```

**Dos vías equivalentes desde el primer momento.** La carga de archivo no es un
plan B escondido: ocupa el mismo espacio visual que la cámara. Quien deniegue el
permiso, use un navegador sin soporte o no tenga cámara conectada encuentra la
alternativa sin buscarla.

## 3. Cámara activa

```
┌───────────────────────────────────────────────┐
│  CAPTURA TU PROBLEMA                          │
│  ┌─────────────────────────────────────────┐ │
│  │                                         │ │
│  │        [ vista previa en vivo ]         │ │
│  │                                         │ │
│  └─────────────────────────────────────────┘ │
│  ┌───────────────────────┐ ┌──────────────┐  │
│  │      Tomar foto       │ │   Cancelar   │  │
│  └───────────────────────┘ └──────────────┘  │
└───────────────────────────────────────────────┘
```

La vista previa ocupa el ancho completo: encuadrar bien es lo que más influye en
la precisión del reconocimiento, así que se le da todo el espacio disponible.
«Cancelar» apaga la cámara de verdad —corta las pistas del stream—, no sólo
oculta la vista.

## 4. Resultado y resolución

```
┌───────────────────────────────────────────────┐
│  RESULTADO                                    │
│                                               │
│              ⌠1                               │
│              ⌡0  x² dx          ← KaTeX       │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ \int_0^1 x^2\,dx            ← LaTeX     │ │
│  └─────────────────────────────────────────┘ │
│  ┌──────────────┐                            │
│  │ Copiar LaTeX │                            │
│  └──────────────┘                            │
├───────────────────────────────────────────────┤
│  RESOLUCIÓN                    ┌───────────┐  │
│                                │ Resolver  │  │
│                                └───────────┘  │
│                                               │
│  RESULTADO                                    │
│       1/3                                     │
│                                               │
│  PASO A PASO                                  │
│  ┌─────────────────────────────────────────┐ │
│  │ 1. Planteamos la integral que se debe   │ │
│  │    calcular.        ⌠1                  │ │
│  │                     ⌡0 x² dx            │ │
│  ├─────────────────────────────────────────┤ │
│  │ 2. Calculamos la antiderivada de x²     │ │
│  │    respecto de x.       x³/3            │ │
│  ├─────────────────────────────────────────┤ │
│  │ 3. Evaluamos la antiderivada entre 0    │ │
│  │    y 1.                 1/3             │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Verifica siempre el resultado: el            │
│  reconocimiento de la imagen puede            │
│  equivocarse.                                 │
└───────────────────────────────────────────────┘
```

Tres decisiones deliberadas en esta pantalla:

**El LaTeX se muestra antes de resolver, y resolver es un botón.** No se
encadena automáticamente. Es el punto de verificación humana: si el
reconocimiento leyó otra cosa, el usuario lo detecta *antes* de que el sistema
resuelva el problema equivocado. También evita gastar cuota de API en
transcripciones que el usuario habría descartado.

**El procedimiento se muestra completo, no sólo la respuesta.** Quien sólo
quiera el número lo tiene arriba; quien quiera entender, tiene el desarrollo
debajo. El diseño favorece el uso pedagógico sin impedir el uso rápido.

**El aviso de verificación es permanente**, no un mensaje que se descarta. Un
resultado bien maquetado proyecta más certeza de la que merece.

## 5. Estados de error

La interfaz distingue el motivo, porque la acción que debe tomar la persona es
distinta en cada caso:

| Situación | Mensaje | Acción ofrecida |
|---|---|---|
| Permiso de cámara denegado | Explica cómo desbloquearlo desde la barra del navegador | Reintentar · subir imagen |
| Sin cámara conectada | Indica que no se encontró ninguna | Subir imagen |
| Navegador sin soporte | Sugiere otro navegador | Subir imagen (sin reintentar: no cambiaría nada) |
| Sin expresión en la imagen | Sugiere mejor iluminación y encuadrar sólo la expresión | Volver a capturar |
| Fallo de red o del servidor | Muestra el error | **Reintentar con la misma imagen**, sin recapturar |

```
┌───────────────────────────────────────────────┐
│  ⚠  Bloqueaste el acceso a la cámara.        │
│     Permítelo desde el icono junto a la       │
│     dirección del navegador, o sube una       │
│     imagen desde tu dispositivo.              │
│     ┌─────────────┐                           │
│     │ Reintentar  │                           │
│     └─────────────┘                           │
└───────────────────────────────────────────────┘
```

El caso del navegador sin soporte **no ofrece reintentar** a propósito: repetir
no cambiaría el resultado y ofrecerlo sería engañoso.

## 6. Panel de métricas

Colapsado por omisión, al pie de la pantalla:

```
┌───────────────────────────────────────────────┐
│  − MÉTRICAS TÉCNICAS                          │
│  Acumuladas desde que arrancó el servicio.    │
│                              ┌─────────────┐  │
│                              │ Actualizar  │  │
│                              └─────────────┘  │
│  ┌────────┬────────┬────────┬────────┐       │
│  │PETICIO.│LATENCIA│  CPU   │MEMORIA │       │
│  │   12   │ 120 ms │  8.3 % │ 143 MB │       │
│  │1 error │p95 1.5s│        │        │       │
│  └────────┴────────┴────────┴────────┘       │
│  ┌──────────┬──────────┬──────────┐          │
│  │ LLAMADAS │  TOKENS  │  COSTO   │          │
│  │    4     │  3.140   │$0.000942 │          │
│  │          │2.028 raz.│          │          │
│  └──────────┴──────────┴──────────┘          │
│                                               │
│  Ruta                 Peticiones  p50   p95   │
│  /api/v1/recognition       4     1.35s 1.48s  │
│  /api/v1/solve             8      90ms  130ms │
└───────────────────────────────────────────────┘
```

Va colapsado porque es información de diagnóstico, no parte del flujo de quien
viene a resolver un ejercicio. Y sólo consulta al desplegarse: pedir métricas
que nadie está mirando añadiría tráfico y alteraría justamente lo que se mide.

## 7. Diseño responsive

| Ancho | Comportamiento |
|---|---|
| ≥ 640 px | Captura y carga en dos columnas; botones de cámara en fila |
| < 640 px | Todo en una columna; botones apilados a ancho completo |
| 360 px | Ancho mínimo verificado; sin desbordamiento horizontal |

El caso móvil no es secundario: **es el principal**. Fotografiar un cuaderno se
hace con el teléfono, no con un portátil.

## 8. Accesibilidad

- Etiquetas descriptivas en todos los controles, incluida la vista de cámara.
- Foco visible en cada elemento interactivo; recorrido completo por teclado.
- Los cambios de estado —reconociendo, error, sin expresión— se anuncian a los
  lectores de pantalla mediante regiones activas y roles de alerta.
- Los iconos decorativos se ocultan de la lectura asistida.
- Contraste suficiente entre texto y fondo en toda la paleta.

## 9. Paleta y tipografía

Escala de grises (`slate`) con acentos semánticos: rojo para error, ámbar para
advertencia. Deliberadamente sobria: la atención debe estar en la expresión
matemática, no en la interfaz. El único elemento cromático fuerte es el
identificador ∑ de la cabecera.

Tipografía del sistema para la interfaz; KaTeX aporta su propia tipografía
matemática. El LaTeX en bruto se muestra en monoespaciada, para que se lea como
lo que es: código para copiar y pegar.

---

## 10. Capturas del sistema desplegado

> Las capturas de la interfaz en funcionamiento se incorporan aquí como
> evidencia visual del entregable. Reemplazan a los mockups tradicionales:
> al existir el sistema desplegado, la interfaz real es evidencia más fuerte
> que un prototipo.

| Vista | Archivo |
|---|---|
| Pantalla inicial | `capturas/01-inicio.png` |
| Cámara activa | `capturas/02-camara.png` |
| Resultado y pasos | `capturas/03-resolucion.png` |
| Panel de métricas | `capturas/04-metricas.png` |
| Estado de error | `capturas/05-error.png` |

---

## Referencias

- `src/pages/HomePage.tsx` — composición de la pantalla.
- `src/components/` — implementación de cada bloque.
- [`../product/backlog-sprint2.md`](../product/backlog-sprint2.md) — ítem PB-19 (mockups).
