<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $code, array $data): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['ok'=>false]);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) respond(413, ['ok'=>false]);
try { $input = json_decode(file_get_contents('php://input', false, null, 0, 16385), true, 32, JSON_THROW_ON_ERROR); }
catch (Throwable $e) { respond(400, ['ok'=>false]); }
if (!is_array($input) || array_is_list($input)) respond(400, ['ok'=>false]);
if (!empty($input['website'])) respond(400, ['ok'=>false]);
$required = ['name'=>120, 'company'=>160, 'role'=>80, 'email'=>254, 'phone'=>24];
foreach ($required as $key=>$limit) {
  if (!isset($input[$key]) || !is_string($input[$key]) || trim($input[$key]) === '' || strlen($input[$key]) > $limit * 4) respond(422, ['ok'=>false]);
}
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL) || !preg_match('/^\+52[0-9]{10}$/', $input['phone']) || ($input['consent'] ?? null) !== true) respond(422, ['ok'=>false]);
if (!in_array($input['role'], ['Recursos Humanos','Seguridad e Higiene','Servicio médico','Dirección','Otra área'], true)) respond(422, ['ok'=>false]);
foreach (['interest'=>1000,'utm_source'=>120,'utm_medium'=>120,'utm_campaign'=>120,'utm_content'=>120,'landing_path'=>300] as $key=>$limit) {
  if (isset($input[$key]) && (!is_string($input[$key]) || strlen($input[$key]) > $limit * 4)) respond(422, ['ok'=>false]);
}
$webhook = getenv('LEVIATAN_WEBHOOK_URL');
if (!$webhook || !filter_var($webhook, FILTER_VALIDATE_URL) || parse_url($webhook, PHP_URL_SCHEME) !== 'https') respond(503, ['ok'=>false, 'code'=>'integration_unavailable']);
$payload = [];
foreach (array_merge(array_keys($required), ['interest','utm_source','utm_medium','utm_campaign','utm_content','landing_path']) as $key) $payload[$key] = trim($input[$key] ?? '');
$parts = preg_split('/\s+/u', $payload['name'], 2);
$payload['first_name'] = $parts[0];
$payload['last_name'] = $parts[1] ?? '';
$payload['tags'] = 'ICqUS-ARHITAC-2026';
$payload['source'] = 'ICqUS · ARHITAC 2026';
$payload['consent'] = true;
$payload['consent_text'] = 'Autorizo que Grupo GAMI me contacte sobre esta solicitud por WhatsApp o correo electrónico.';
$payload['submitted_at'] = gmdate('c');
$payload['request_id'] = bin2hex(random_bytes(16));
$curl = curl_init($webhook);
curl_setopt_array($curl, [CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>json_encode($payload, JSON_UNESCAPED_UNICODE),CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>12,CURLOPT_FOLLOWLOCATION=>false]);
$result = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
if ($result === false || $code < 200 || $code >= 300) respond(502, ['ok'=>false, 'code'=>'registration_failed']);
respond(200, ['ok'=>true]);
