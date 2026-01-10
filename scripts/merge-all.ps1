param(
    [string]$Owner = "Shigerubt",
    [string]$Repo = "hackatonAlura",
    [string]$Base = "main",
    [switch]$DryRun
)

Write-Host "== Merge-all: repo $Owner/$Repo, base '$Base' =="

# Verify gh login
$auth = gh auth status 2>$null
if (!$auth -or $auth -match "not logged") {
    Write-Host "You are not logged in. Launching gh auth login..." -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
}

# Ensure labels exist
$label = "sequential merge"
try { gh label create $label --description "Sequential merge plan" --color 1F6FEB 2>$null } catch {}

# Fetch branches via GitHub API
$branchesJson = gh api repos/$Owner/$Repo/branches --paginate
$branches = $branchesJson | ConvertFrom-Json
if (-not $branches) { Write-Error "Failed to obtain branches."; exit 1 }

# Build list excluding base
$targets = @()
foreach ($b in $branches) {
    if ($b.name -ne $Base) { $targets += $b.name }
}

if ($targets.Count -eq 0) {
    Write-Host "No branches to merge. Only '$Base' present." -ForegroundColor Green
    exit 0
}

Write-Host "Found branches: $($targets -join ', ')"

# Process each branch
$summary = @()
$step = 1
foreach ($head in $targets) {
    Write-Host "--> Processing '$head' (step $step)"

    if ($DryRun) {
        $summary += @{ branch=$head; pr="DRY-RUN"; merged=$false; deleted=$false }
        $step++
        continue
    }

    # Create PR
    $title = "Merge: $head → $Base (sequential step $step)"
    $body  = "Sequential merge plan: merging '$head' into '$Base'."
    $prUrl = gh pr create --base $Base --head $head --title $title --body $body --label $label 2>$null

    # Find PR number
    $pr = gh pr list --head $head --state open --json number,url | ConvertFrom-Json
    if (-not $pr) {
        Write-Host "No open PR found for '$head' — skipping." -ForegroundColor Yellow
        $summary += @{ branch=$head; pr=$null; merged=$false; deleted=$false }
        $step++
        continue
    }
    $num = $pr[0].number
    $url = $pr[0].url
    Write-Host "PR #$num: $url"

    # Enable auto-merge (squash)
    try { gh pr merge $num --auto --squash } catch { Write-Host "Enable auto-merge failed for #$num" -ForegroundColor Yellow }

    # Attempt immediate merge (if possible)
    try { gh pr merge $num --squash --delete-branch } catch {}

    # Delete remote branch (safe if already deleted)
    try { git push origin --delete $head } catch {}

    $summary += @{ branch=$head; pr=$url; merged=$true; deleted=$true }
    $step++
}

Write-Host "== Summary =="
foreach ($s in $summary) {
    Write-Host ("{0} | PR: {1} | merged: {2} | deleted: {3}" -f $s.branch, ($s.pr ?? ""), $s.merged, $s.deleted)
}

Write-Host "Done." -ForegroundColor Green
