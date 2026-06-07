# Yönetici PowerShell'de çalıştırın:
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   .\scripts\fix-windows-muhasebe-hosts.ps1

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$marker = "# muhasebe.localhost (muhasebe dev)"
$line = "127.0.0.1 muhasebe.localhost api.muhasebe.localhost"

$content = Get-Content $hostsPath -Raw -ErrorAction Stop
if ($content -match 'muhasebe\.localhost') {
    Write-Host "hosts zaten muhasebe.localhost içeriyor."
} else {
    Add-Content -Path $hostsPath -Value "`n$marker`n$line"
    Write-Host "Eklendi: $line"
}
Write-Host "Tarayicida acin: http://muhasebe.localhost"
