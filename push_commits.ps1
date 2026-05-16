$unpushed = git log origin/main..main --oneline --reverse | ForEach-Object { $_.Split(" ")[0] }

foreach ($commit in $unpushed) {
    Write-Host "Pushing commit $commit..."
    git push origin "$($commit):main"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push commit $commit"
        exit 1
    }
}
