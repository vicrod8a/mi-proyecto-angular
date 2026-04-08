# Script para ejecutar setup.sql en PostgreSQL
# Uso: .\setup-db.ps1 -Password "tu_contraseña"

param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

# Ruta a PostgreSQL
$PgPath = "C:\Program Files\PostgreSQL\18\bin"
$env:PATH = "$PgPath;$env:PATH"
$env:PGPASSWORD = $Password

# Ruta del script SQL
$SqlFile = "C:\Users\vicoe\mi-proyecto\database\setup.sql"

Write-Host "Ejecutando script de setup..." -ForegroundColor Green
psql -U postgres -h localhost -f $SqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Base de datos creada exitosamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al crear la base de datos" -ForegroundColor Red
}

# Limpiar variable de contraseña
Remove-Item Env:\PGPASSWORD
