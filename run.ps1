#Requires -Version 5.1
[CmdletBinding()]
param(
    [switch]$Build,
    [switch]$NoCache
)

function Get-DockerPath {
    $candidates = @(
        "docker",
        "C:\Program Files\Docker\Docker\resources\bin\docker.exe",
        "C:\Program Files\Docker\Docker\DockerCli.exe"
    )
    foreach ($p in $candidates) {
        try {
            $exists = $false
            if ($p -eq "docker") {
                $exists = (Get-Command docker -ErrorAction SilentlyContinue) -ne $null
            } else {
                $exists = Test-Path $p
            }
            if ($exists) { return $p }
        } catch {}
    }
    throw "Docker CLI not found in PATH or common locations"
}

function Compose {
    param([string]$Docker, [string]$ComposeFile, [string[]]$CommandArgs)
    if ($Docker -eq "docker") {
        & docker compose -f $ComposeFile @CommandArgs
    } else {
        & $Docker compose -f $ComposeFile @CommandArgs
    }
}

function Wait-HttpOk {
    param(
        [string]$Url,
        [int]$Retries = 180,
        [int]$DelaySeconds = 2,
        [hashtable]$Headers
    )

    for ($i = 0; $i -lt $Retries; $i++) {
        try {
            $params = @{
                Uri = $Url
                UseBasicParsing = $true
                TimeoutSec = 60
            }

            if ($Headers) {
                $params.Headers = $Headers
            }

            $res = Invoke-RestMethod @params
            return $res
        } catch {
            Start-Sleep -Seconds $DelaySeconds
        }
    }

    throw "Timeout waiting for $Url"
}

function Wait-PortOpen {
    param(
        [string]$HostName = "127.0.0.1",
        [int]$Port,
        [int]$Retries = 100,
        [int]$DelaySeconds = 2
    )
    for ($i = 0; $i -lt $Retries; $i++) {
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $async = $client.BeginConnect($HostName, $Port, $null, $null)
            if ($async.AsyncWaitHandle.WaitOne(1000)) {
                $client.EndConnect($async)
                $client.Close()
                return $true
            }
            $client.Close()
        } catch {
            # ignore and retry
        }
        Start-Sleep -Seconds $DelaySeconds
    }
    throw ("Timeout waiting for {0}:{1}" -f $HostName, $Port)
}

Push-Location $PSScriptRoot
$composeFile = Join-Path $PSScriptRoot "docker-compose.yml"
$docker = Get-DockerPath

Write-Host "Starting containers via Docker Compose..." -ForegroundColor Cyan

if ($NoCache) {
    Write-Host "Building images with --no-cache..." -ForegroundColor Cyan
    Compose -Docker $docker -ComposeFile $composeFile -CommandArgs @("build", "--no-cache")
}

$composeArgs = @("up", "-d")
if ($Build) {
    $composeArgs += "--build"
    $composeArgs += "--force-recreate"
}
Compose -Docker $docker -ComposeFile $composeFile -CommandArgs $composeArgs

Write-Host "Waiting for DS health (http://127.0.0.1:8000/health)..." -ForegroundColor Cyan
$ds = Wait-HttpOk -Url "http://localhost:8000/health"
Write-Host "DS status: $($ds.status)" -ForegroundColor Green

Write-Host "Waiting for API TCP readiness (localhost:8080)..." -ForegroundColor Cyan
$null = Wait-PortOpen -HostName "127.0.0.1" -Port 8080 -Retries 60 -DelaySeconds 2
Write-Host "API port open." -ForegroundColor Green

Write-Host "Obtaining JWT and checking API health..." -ForegroundColor Cyan
$loginBody = @{ email = "admin@local"; password = "Admin123!" } | ConvertTo-Json

# Retry login for resilience during startup
$maxLoginRetries = 10
$loginDelaySeconds = 3
$token = $null
for ($i = 0; $i -lt $maxLoginRetries; $i++) {
    try {
        $res = Invoke-RestMethod -Method POST -Uri "http://127.0.0.1:8080/api/auth/login" -ContentType "application/json" -Body $loginBody -UseBasicParsing
        $token = $res.token
        if ($token) { break }
    } catch {
        Start-Sleep -Seconds $loginDelaySeconds
    }
}
if (-not $token) { throw "Failed to obtain JWT after $maxLoginRetries attempts" }

$headers = @{ Authorization = "Bearer $token" }
$api = Wait-HttpOk -Url "http://127.0.0.1:8080/actuator/health" -Headers $headers
Write-Host "API status: $($api.status)" -ForegroundColor Green

Write-Host "Opening dashboard and frontend..." -ForegroundColor Cyan
Start-Process "http://localhost:8501"
Start-Process "http://localhost:5173"

Write-Host "Done. Containers are running. Use 'docker compose ps' and 'docker compose logs -f' for status/logs." -ForegroundColor Green
Pop-Location
