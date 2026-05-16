$unpushed = git log origin/main..main --oneline --reverse | ForEach-Object { $_.Split(" ")[0] }

foreach ($commit in $unpushed) {
    if ([string]::IsNullOrWhiteSpace($commit)) { continue }
    Write-Host "Pushing unpushed commit $commit..."
    $retry = 0
    while ($retry -lt 10) {
        git push origin "$($commit):main"
        if ($LASTEXITCODE -eq 0) {
            break
        }
        Write-Host "Push failed, retrying in 10 seconds..."
        Start-Sleep -Seconds 10
        $retry++
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push $commit after 10 retries. Exiting."
        exit 1
    }
}

$files = git ls-files --others --exclude-standard
$i = 1

foreach ($file in $files) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    Write-Host "Processing file $i of $($files.Count): $file"
    git add "`"$file`""
    git commit -m "Add image $i"
    $retry = 0
    while ($retry -lt 10) {
        git push
        if ($LASTEXITCODE -eq 0) {
            break
        }
        Write-Host "Push failed, retrying in 10 seconds..."
        Start-Sleep -Seconds 10
        $retry++
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push $file after 10 retries. Exiting."
        exit 1
    }
    $i++
}
Write-Host "All files pushed successfully."
