<?php
// Local preview only; production route uses .htaccess.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/api/solicitudes') { require __DIR__ . '/api/solicitudes.php'; return true; }
$file = realpath(__DIR__ . '/dist' . $path);
$public = realpath(__DIR__ . '/dist');
if ($file && str_starts_with($file, $public . DIRECTORY_SEPARATOR) && is_file($file)) return false;
if ($path === '/') { readfile(__DIR__ . '/dist/index.html'); return true; }
http_response_code(404); echo 'Página no encontrada';
