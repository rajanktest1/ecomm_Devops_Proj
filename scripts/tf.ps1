# tf.ps1 — Terraform wrapper for ShopEase
# Usage (from project root):
#   .\scripts\tf.ps1 plan
#   .\scripts\tf.ps1 apply
#   .\scripts\tf.ps1 destroy
#
# Why this exists:
#   Azure CLI installs to a path that is only picked up by NEW terminals.
#   Existing terminals keep the old PATH and terraform cannot launch `az`
#   to resolve credentials. This script reloads the machine + user PATH
#   before delegating to terraform.

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$TerraformArgs
)

# ── 1. Reload PATH so `az` is visible in this session ─────────────────────────
$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath    = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH    = "$machinePath;$userPath"

# ── 2. Verify az is now reachable ─────────────────────────────────────────────
$azCmd = Get-Command az -ErrorAction SilentlyContinue
if (-not $azCmd) {
    # Fallback to known install location
    $fallback = "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"
    if (Test-Path $fallback) {
        $env:PATH = "$env:PATH;$fallback"
        Write-Host "INFO: Added Azure CLI fallback path: $fallback" -ForegroundColor Yellow
    } else {
        Write-Error "Azure CLI not found. Install it with: winget install --id Microsoft.AzureCLI"
        exit 1
    }
}

# ── 3. Confirm login ───────────────────────────────────────────────────────────
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Not logged in. Running 'az login'..." -ForegroundColor Yellow
    az login
}
else {
    Write-Host "Logged in as: $($account.user.name)  |  Subscription: $($account.name)" -ForegroundColor Cyan
}

# ── 4. Run terraform from the terraform/ directory ────────────────────────────
Push-Location "$PSScriptRoot\..\terraform"
try {
    terraform @TerraformArgs
} finally {
    Pop-Location
}
