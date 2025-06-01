# PowerShell script to keep WiFi connection alive# Useful during long-running cosmological simulations
$wifiInterface = (Get-NetAdapter | Where-Object {$_.Name -like "*Wi-Fi*"}).Name
$pingTarget = "8.8.8.8"  # Google DNS server$interval = 300  # Check every 5 minutes
while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"    Write-Host "[$timestamp] Checking WiFi connection..."
        # Test connection
    $pingResult = Test-Connection -ComputerName $pingTarget -Count 1 -Quiet    
    if (-not $pingResult) {        Write-Host "Connection lost. Attempting to reset WiFi interface..."
        Disable-NetAdapter -Name $wifiInterface -Confirm:$false        Start-Sleep -Seconds 5
        Enable-NetAdapter -Name $wifiInterface -Confirm:$false        Write-Host "WiFi interface reset completed."
    } else {
        Write-Host "Connection is stable."    }    
    Start-Sleep -Seconds $interval
}












