# Jenkins Integration Setup Guide

This guide will help you integrate your repository with Jenkins to automatically generate pull request reports.

## Prerequisites

- Jenkins server running on GCP VM
- Repository connected to Jenkins
- GitHub webhook access (if using GitHub)

## Option 1: Simple Setup (Recommended for beginners)

Use `Jenkinsfile.simple` - this will generate a report every time Jenkins builds the repository.

### Steps:
1. Rename `Jenkinsfile.simple` to `Jenkinsfile`
2. Commit and push to your repository
3. In Jenkins, create a new pipeline job
4. Point it to your repository
5. Set up polling or webhook triggers

## Option 2: Advanced Setup with Pull Request Detection

Use the main `Jenkinsfile` - this requires more configuration but provides better pull request detection.

### Required Jenkins Plugins:
- Generic Webhook Trigger Plugin
- Git plugin
- Pipeline plugin

### Configuration Steps:

#### 1. Install Required Plugins
In Jenkins, go to **Manage Jenkins** > **Manage Plugins** > **Available** and install:
- Generic Webhook Trigger Plugin
- Git plugin
- Pipeline plugin

#### 2. Create Jenkins Pipeline Job
1. Go to **New Item** > **Pipeline**
2. Name your job (e.g., "PR-Report-Generator")
3. In **Pipeline** section, select **Pipeline script from SCM**
4. Choose **Git** as SCM
5. Enter your repository URL
6. Set branch to `*/main` or `*/master`
7. Script path: `Jenkinsfile`

#### 3. Configure Webhook Trigger
1. In your pipeline job, go to **Build Triggers**
2. Check **Generic Webhook Trigger**
3. Set **Token** to a secure value (e.g., `your-secret-token`)
4. Update the token in your `Jenkinsfile` (replace `your-webhook-token-here`)

#### 4. Set Up GitHub Webhook
1. Go to your GitHub repository
2. **Settings** > **Webhooks** > **Add webhook**
3. **Payload URL**: `http://your-jenkins-url/generic-webhook-trigger/invoke`
4. **Content type**: `application/json`
5. **Secret**: Use the same token from Jenkins
6. **Events**: Select **Pull requests** and **Pushes**
7. Click **Add webhook**

#### 5. Configure Jenkins Security
1. **Manage Jenkins** > **Configure Global Security**
2. Ensure **CSRF Protection** is enabled
3. Configure **Authorization** as needed

## Option 3: Manual Trigger Setup

If you prefer manual control:

1. Use `Jenkinsfile.simple`
2. In Jenkins job configuration, don't set any triggers
3. Manually trigger builds when needed
4. Or set up polling (e.g., every 5 minutes)

## Testing the Setup

### Test Webhook (Option 2):
```bash
curl -X POST http://your-jenkins-url/generic-webhook-trigger/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "ref": "refs/pull/123/head",
    "action": "opened",
    "pull_request": {
      "number": 123,
      "title": "Test PR",
      "updated_at": "2024-01-01T12:00:00Z"
    },
    "sender": {
      "login": "testuser"
    }
  }'
```

### Test Manual Build:
1. Go to your Jenkins job
2. Click **Build Now**
3. Check the console output
4. Verify the generated text files in **Build Artifacts**

## Expected Output

The pipeline will generate:
- `pr_report_YYYYMMDD_HHMMSS.txt` - Timestamped report for each build
- `latest_pr_report.txt` - Most recent report (overwritten each time)

## Troubleshooting

### Common Issues:

1. **Webhook not triggering**: Check Jenkins URL accessibility and webhook configuration
2. **Permission denied**: Verify Jenkins has access to your repository
3. **Build failing**: Check Jenkins console output for specific errors
4. **Files not generated**: Ensure the pipeline stages are executing correctly

### Debug Steps:
1. Check Jenkins console output
2. Verify webhook delivery in GitHub
3. Test webhook manually with curl
4. Check Jenkins system logs

## Security Considerations

- Use strong, unique tokens for webhooks
- Restrict Jenkins access to necessary users only
- Consider using HTTPS for webhook URLs
- Regularly rotate webhook tokens

## Next Steps

After successful setup:
1. Customize the report format in the Jenkinsfile
2. Add additional pipeline stages (testing, deployment, etc.)
3. Set up notifications (email, Slack, etc.)
4. Configure build retention policies

## Support

If you encounter issues:
1. Check Jenkins system logs
2. Verify plugin versions are compatible
3. Ensure all required permissions are set
4. Test with a simple pipeline first
