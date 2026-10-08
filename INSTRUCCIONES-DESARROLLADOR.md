# Instrucciones para publicar la landing en icqus.mx

Vista previa del diseño: https://yetiac.github.io/icqus-landing/ (sin envío de formulario, GitHub no ejecuta PHP).

## Qué se publica

La landing va solo en la raíz `icqus.mx` (y `www`). **La app sigue en `https://v2.icqus.mx/app_Login/` y no se toca.**

Copiar a la carpeta pública del dominio (por ejemplo `public_html/`):

```
index.html
styles.css
app.js
video-config.js
favicon.svg
assets/            (todas las imágenes)
api/solicitudes.php
.htaccess          (es el archivo cloudways.htaccess renombrado)
```

Todo sale de `dist/` más `api/solicitudes.php` y `cloudways.htaccess`. No subir `router.php` (solo es para pruebas locales), `.env.example`, `referencias/` ni `.github/`.

## Requisitos del hosting

- Apache con `mod_rewrite` (la regla `/api/solicitudes` → `api/solicitudes.php` está en `.htaccess`).
- PHP 8.1 o superior con la extensión cURL.
- HTTPS activo en `icqus.mx` y `www.icqus.mx`.

## Conexión con Leviatán 360

El formulario envía a `/api/solicitudes`. Ese PHP valida los datos y los reenvía en JSON al webhook de Leviatán. La URL del webhook **la proporciona Grupo GAMI** y nunca va en el JavaScript ni en el repositorio.

Configurarla de una de estas formas (la primera que exista se usa):

1. **Variable de entorno** `LEVIATAN_WEBHOOK_URL` en el servidor, o `SetEnv LEVIATAN_WEBHOOK_URL "https://..."` en la configuración de Apache.
2. **Archivo fuera de la carpeta pública**, un nivel arriba de `public_html/`, llamado `icqus-config.php`:

   ```php
   <?php
   return ['LEVIATAN_WEBHOOK_URL' => 'https://services.leadconnectorhq.com/hooks/...'];
   ```

   Ruta esperada: si la landing está en `/home/usuario/public_html/`, el archivo va en `/home/usuario/icqus-config.php`.

Sin webhook, el formulario responde «no pudimos registrar tu solicitud» y ofrece WhatsApp; nunca simula un registro exitoso.

## DNS (Cloudflare)

El DNS de icqus.mx está en Cloudflare. Cambiar **solo**:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | IP del hosting de la landing |
| CNAME | `www` | `icqus.mx` |

No modificar `v2`, `mail`, MX ni TXT (correo y SPF). No crear registro comodín `*`. Si se activa el proxy de Cloudflare, usar SSL **Full (strict)** y confirmar que `v2.icqus.mx` sigue cargando. No activar HSTS con `includeSubDomains`.

## Verificación

1. `https://icqus.mx` y `https://www.icqus.mx` cargan la landing con HTTPS.
2. El botón «Ingresar a la plataforma» abre `https://v2.icqus.mx/app_Login/` y la app funciona igual que antes.
3. `curl -X POST https://icqus.mx/api/solicitudes -H 'Content-Type: application/json' -d '{}'` responde `{"ok":false}` con código 400 (la ruta PHP está activa; un 404 indica que falta el `.htaccess`).
4. Avisar a Grupo GAMI para hacer el registro de prueba: debe aparecer el contacto en Leviatán con la etiqueta `icqus-arhitac-2026`, la oportunidad en el pipeline «ICqUS · Evaluaciones empresariales» y el correo de confirmación.

## Cambios

Para cambios en la landing, abrir un pull request en este repositorio o enviar los archivos a Grupo GAMI.
