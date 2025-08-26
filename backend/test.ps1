# Build request body with answers
$body = @{
  answers = @(
    "Coding",
    "Problem-solving",
    "Remote",
    "Analytical",
    "Computer Science",
    "Python/Java",
    "Data",
    "Research & analyze",
    "Structured",
    "Solving complex problems",
    "Yes, love it",
    "Depends on task",
    "Very important",
    "Logical and structured",
    "Yes, often",
    "Detail-oriented",
    "Yes, frequently",
    "Creating something new",
    "Yes, a lot",
    "Innovation & creativity"
  )
} | ConvertTo-Json -Compress -Depth 5

# Call backend quiz analyzer endpoint
$response = Invoke-RestMethod `
  -Uri "http://localhost:5000/api/quiz/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Print raw JSON instead of PowerShell object
$response | ConvertTo-Json -Depth 10
