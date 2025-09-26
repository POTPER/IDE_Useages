# fix-path-permanent.ps1 - Cursor IDE PowerShell 终端永久修复脚本
# 作者: ODOkai
# 时间: 2025-09-26

Write-Host "🔧 开始修复 Cursor IDE PowerShell 终端 PATH 问题..." -ForegroundColor Cyan

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  警告: 需要管理员权限进行永久修复" -ForegroundColor Yellow
    Write-Host "   建议: 以管理员身份运行 PowerShell 或 Cursor IDE" -ForegroundColor Yellow
    Write-Host "   当前执行: 仅临时修复（重启后失效）`n" -ForegroundColor Yellow
}

# 检查并添加常用程序路径
$pathsToAdd = @(
    "C:\Program Files\nodejs",
    "C:\Program Files\Git\bin", 
    "C:\Program Files\Git\cmd",
    "C:\Program Files\Go\bin",
    "C:\Program Files\Python39",
    "C:\Program Files\Python310", 
    "C:\Program Files\Python311",
    "C:\Program Files\Python312",
    "C:\Program Files\Python313",
    "C:\Users\$env:USERNAME\.dotnet\tools",
    "C:\Users\$env:USERNAME\AppData\Roaming\npm"
)

Write-Host "📋 检查需要添加的路径:" -ForegroundColor Green

$pathsFound = @()
$pathsNotFound = @()

foreach ($path in $pathsToAdd) {
    if (Test-Path $path) {
        $pathsFound += $path
        Write-Host "  ✅ $path" -ForegroundColor Green
    } else {
        $pathsNotFound += $path
        Write-Host "  ❌ $path (未安装)" -ForegroundColor Red
    }
}

if ($pathsFound.Count -eq 0) {
    Write-Host "`n❌ 未找到任何需要添加的程序路径" -ForegroundColor Red
    Write-Host "   可能需要先安装 Node.js、Git 等程序" -ForegroundColor Yellow
    exit
}

# 获取当前用户的 PATH
$currentUserPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
$currentMachinePath = [Environment]::GetEnvironmentVariable('PATH', 'Machine')

# 检查哪些路径需要添加
$pathsToAddToUser = @()
$pathsToAddToMachine = @()

foreach ($path in $pathsFound) {
    $inUserPath = $currentUserPath -split ';' | Where-Object { $_.Trim() -eq $path }
    $inMachinePath = $currentMachinePath -split ';' | Where-Object { $_.Trim() -eq $path }
    
    if (-not $inUserPath -and -not $inMachinePath) {
        if ($isAdmin) {
            $pathsToAddToMachine += $path
        } else {
            $pathsToAddToUser += $path
        }
    }
}

# 临时修复 (当前会话)
Write-Host "`n🔄 应用临时修复 (当前会话):" -ForegroundColor Yellow
foreach ($path in $pathsFound) {
    if ($env:PATH -notlike "*$path*") {
        $env:PATH += ";$path"
        Write-Host "  ➕ 已添加: $path" -ForegroundColor Green
    }
}

# 永久修复
if ($isAdmin -and $pathsToAddToMachine.Count -gt 0) {
    Write-Host "`n🔧 应用永久修复 (系统级):" -ForegroundColor Green
    $newMachinePath = $currentMachinePath
    foreach ($path in $pathsToAddToMachine) {
        $newMachinePath += ";$path"
        Write-Host "  ➕ 添加到系统 PATH: $path" -ForegroundColor Green
    }
    [Environment]::SetEnvironmentVariable('PATH', $newMachinePath, 'Machine')
    Write-Host "  ✅ 系统 PATH 已更新" -ForegroundColor Green
}

if ($pathsToAddToUser.Count -gt 0) {
    Write-Host "`n🔧 应用永久修复 (用户级):" -ForegroundColor Green
    $newUserPath = $currentUserPath
    foreach ($path in $pathsToAddToUser) {
        $newUserPath += ";$path"
        Write-Host "  ➕ 添加到用户 PATH: $path" -ForegroundColor Green
    }
    [Environment]::SetEnvironmentVariable('PATH', $newUserPath, 'User')
    Write-Host "  ✅ 用户 PATH 已更新" -ForegroundColor Green
}

# 测试命令可用性
Write-Host "`n🧪 测试命令可用性:" -ForegroundColor Cyan
$testCommands = @('node', 'npm', 'git', 'go', 'python', 'dotnet')

foreach ($cmd in $testCommands) {
    try {
        $result = Get-Command $cmd -ErrorAction SilentlyContinue
        if ($result) {
            $version = & $cmd --version 2>$null
            if ($version) {
                Write-Host "  ✅ $cmd : $version" -ForegroundColor Green
            } else {
                Write-Host "  ✅ $cmd : 可用" -ForegroundColor Green
            }
        } else {
            Write-Host "  ❌ $cmd : 不可用" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ $cmd : 不可用" -ForegroundColor Red
    }
}

Write-Host "`n✨ 修复完成!" -ForegroundColor Green

if ($isAdmin) {
    Write-Host "✅ 永久修复已应用，重启 Cursor IDE 后仍然有效" -ForegroundColor Green
} else {
    Write-Host "⚠️  仅应用了临时修复" -ForegroundColor Yellow
    Write-Host "💡 要应用永久修复，请以管理员身份运行此脚本" -ForegroundColor Yellow
}

Write-Host "`n📋 后续建议:" -ForegroundColor Cyan
Write-Host "1. 重启 Cursor IDE 验证修复效果" -ForegroundColor White
Write-Host "2. 如果问题仍然存在，请检查系统环境变量设置" -ForegroundColor White
Write-Host "3. 可以运行 .\diagnose-terminal.ps1 进行详细诊断" -ForegroundColor White
