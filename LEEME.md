# ICqUS · Landing ARHITAC 2026

Dirección y contenido confirmados por Daniel: evaluación inicial de salud laboral, contratación independiente de ICqUS, primer contacto por WhatsApp y reunión posterior. Responsable: Dr. Alan Preciado, +52 664 176 2612.

## Estado de entrega

La landing y el formulario visual están implementados. La recepción de solicitudes en Leviatán 360 y las notificaciones al doctor todavía requieren acceso a la cuenta, configuración y una prueba real autorizada. El endpoint devuelve un error si no existe integración; nunca muestra un registro exitoso ficticio. El acceso directo a WhatsApp funciona independientemente del CRM.

La versión en Sites es una vista privada del diseño. Sites no ejecuta el adaptador PHP y no debe usarse para la campaña mientras no tenga un endpoint operativo. El paquete Cloudways contiene la ruta PHP para instalar en el hosting del desarrollador.

## Archivos

- `dist/`: landing HTML, CSS, JavaScript e imágenes.
- `api/solicitudes.php`: adaptador PHP 8.1+ con cURL para envío al webhook de Leviatán.
- `router.php`: servidor local para vista y verificación.
- `cloudways.htaccess`: ruta de producción Apache `/api/solicitudes`.

Vista local: `php -S 127.0.0.1:4327 -t dist router.php`.

## Instalación en Cloudways

El paquete `ICqUS-ARHITAC-2026-Cloudways.zip` debe descomprimirse en el directorio público de la aplicación destinada a `icqus.mx`. Contiene index.html, styles.css, app.js, favicon.svg, assets/, api/solicitudes.php y .htaccess. La aplicación necesita HTTPS, PHP 8.1+ y cURL.

Configurar `LEVIATAN_WEBHOOK_URL` como variable de entorno del servidor. El código no carga archivos .env automáticamente. Nunca copiar el webhook a app.js ni enviarlo como un campo del navegador.

Confirmar el aviso de privacidad enlazado con el responsable de GAMI antes de la campaña. No se añaden cookies publicitarias ni herramientas analíticas de terceros.

## Crear y conectar en Leviatán 360

Identificar primero la subcuenta de Grupo GAMI. Crear la captación «ICqUS · Evaluación inicial · ARHITAC 2026» y un flujo de recepción que:

1. Reciba los campos de la landing.
2. Cree o actualice el contacto mediante la política de duplicados de la cuenta.
3. Conserve empresa, área e interés en campos personalizados disponibles o nuevos.
4. Registre la fuente y las UTM; agregue la etiqueta `ICqUS-ARHITAC-2026`.
5. Cree la oportunidad en el pipeline y etapa que use GAMI para evaluaciones de empresas.
6. Asigne el seguimiento al Dr. Alan Preciado o al usuario operativo confirmado.
7. Notifique al doctor con todos los datos comerciales; la modalidad de notificación depende de los canales habilitados de la cuenta.

Si se prefiere un formulario nativo de Leviatán, crear los mismos campos, configurar la acción posterior y sustituir el formulario de la landing conservando su estilo y el seguimiento. Existe un borrador de formulario nativo en la cuenta de Leviatán; su estado se confirma directamente con Grupo GAMI.

## Datos enviados

`name`, `company`, `role`, `email`, `phone`, `interest`, `source`, `consent`, `consent_text`, `submitted_at`, `request_id`, `landing_path`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

`phone` se normaliza al formato +52 seguido de 10 dígitos. `source` se fija en servidor a `ICqUS · ARHITAC 2026`. El webhook debe aceptar JSON y devolver 2xx después de la recepción. Es necesario verificar en la cuenta que el flujo guarda el contacto y genera el seguimiento; recibir un 2xx del disparador no prueba por sí solo que todas las acciones posteriores terminaron.

## WhatsApp

Después del registro se muestra un botón que abre un mensaje preparado al +52 664 176 2612 con nombre, empresa, área, WhatsApp, correo, interés y origen. El visitante pulsa Enviar dentro de WhatsApp. La entrega automática de datos al doctor debe configurarse por separado en Leviatán; no depende de que el visitante envíe ese mensaje.

Si el registro falla, los datos se conservan en el formulario y aparece una opción de continuar por WhatsApp. Esa opción no registra datos en el CRM. No se almacenan leads en localStorage ni en archivos públicos.

## Verificación antes del QR

Enviar un registro de prueba autorizado. Comprobar todos los campos, origen, consentimiento, propietario, oportunidad y notificación al Dr. Alan. Comprobar el número y el texto preparado en WhatsApp sin enviarlo a un tercero sin autorización. Confirmar las vistas y permisos de la plataforma con el desarrollador. Activar el dominio y revisar desde un teléfono con datos móviles. Registrar la URL final del QR y sus UTM.

La web oficial usa el nombre ARHITAC y anuncia el congreso el 9 de octubre de 2026: https://congresoarhitac.com/. La landing identifica el evento, pero no muestra una fecha.

## Propuesta visual v2 · 1 de octubre de 2026

Se incorporaron el fondo inspirado en los artes del evento, doce iconos de apoyo, una imagen ilustrativa de atención laboral y las herramientas descritas en el sitio del desarrollador. La sección `#demostracion` está lista para recibir el video definitivo; se configura en `dist/video-config.js` y mantiene una invitación honesta mientras no haya video verificado. Las imágenes generadas y sus prompts están documentados en `referencias/prompts-imagenes-v2.txt`.

El estado real de Leviatán y los pasos pendientes se confirman directamente con Grupo GAMI. Crear el formulario nativo no activó el endpoint personalizado de esta landing.

## Ajuste responsive y video provisional · 1 de octubre de 2026

El título de escritorio mantiene tres líneas y un tamaño máximo para evitar cortes al ampliar la ventana. Se verificó a 1920, 1543, 1320, 800 y 390 píxeles.

La sección `#demostracion` muestra provisionalmente el video de Grupo GAMI https://www.youtube.com/watch?v=BJmliuag3j8, solicitado por Daniel. Se comprobó la reproducción dentro de la landing; se conserva un enlace directo a YouTube y la invitación a solicitar una evaluación. El video se sustituye desde `dist/video-config.js`.

## Revisión en GitHub · 8 de octubre de 2026

El encabezado incluye el botón «Ingresar a la plataforma» hacia https://v2.icqus.mx/app_Login/, la app real. En teléfonos pequeños se muestra «Ingresar» y la solicitud queda en la barra inferior.

GitHub Pages publica `dist/` con `.github/workflows/pages.yml`. Es solo vista previa: Pages no ejecuta PHP, así que el formulario mostrará el error de envío y ofrecerá WhatsApp. El envío a Leviatán 360 se prueba en el servidor definitivo.

Para el servidor: subir el contenido de `dist/`, `api/solicitudes.php` y `cloudways.htaccess` renombrado a `.htaccess`, con PHP 8.1+, cURL y la variable `LEVIATAN_WEBHOOK_URL`. Si `icqus.mx` apunta a otro hosting, cambiar en Cloudflare solo los registros `@` y `www`; no modificar `v2`, MX ni TXT.
