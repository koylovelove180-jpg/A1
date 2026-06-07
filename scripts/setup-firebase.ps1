# Firebase setup for card-11c36
# Run after: npx -y firebase-tools@latest login

Write-Host "Deploying Firestore rules and Auth (Email/Password)..." -ForegroundColor Cyan
npx -y firebase-tools@latest deploy --only firestore:rules,auth --project card-11c36

if ($LASTEXITCODE -ne 0) {
  Write-Host "Deploy failed. Run 'npx -y firebase-tools@latest login' first." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Creating teacher user via Firebase Auth..." -ForegroundColor Cyan
$envContent = Get-Content .env -Raw
$apiKey = if ($envContent -match 'VITE_FIREBASE_API_KEY=(.+)') { $Matches[1].Trim() } else { $null }
$teacherEmail = if ($envContent -match 'VITE_TEACHER_EMAIL=(.+)') { $Matches[1].Trim() } else { 'teacher.admin@example.com' }
$teacherPassword = 'Admin-Cook@8Q7m-2026'

if (-not $apiKey) {
  Write-Host "Missing VITE_FIREBASE_API_KEY in .env" -ForegroundColor Red
  exit 1
}

$body = @{
  email = $teacherEmail
  password = $teacherPassword
  returnSecureToken = $true
} | ConvertTo-Json

try {
  $result = Invoke-RestMethod -Method Post -Uri "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$apiKey" -ContentType "application/json" -Body $body
  Write-Host "Teacher user created: $($result.email)" -ForegroundColor Green
} catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $errorBody = $reader.ReadToEnd()
  if ($errorBody -match 'EMAIL_EXISTS') {
    Write-Host "Teacher user already exists: $teacherEmail" -ForegroundColor Yellow
  } else {
    Write-Host "Auth signup response: $errorBody" -ForegroundColor Red
    exit 1
  }
}

Write-Host "Running verification..." -ForegroundColor Cyan
node scripts/verify-firebase.mjs
