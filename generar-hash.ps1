# Script para generar hash de contraseña
$password = "29092004"
$body = @{ password = $password } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8080/utils/generate-hash" -Method Post -Body $body -ContentType "application/json"

Write-Host "Password: $($response.password)" -ForegroundColor Green
Write-Host "Hash generado: $($response.hash)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ejecuta este SQL:" -ForegroundColor Cyan
Write-Host $response.sql -ForegroundColor White
