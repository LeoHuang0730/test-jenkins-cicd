# GitHub Webhook Setup for Jenkins

This guide explains how to configure GitHub webhooks to automatically trigger Jenkins builds when you push code to your repository.

## Prerequisites

1. **Jenkins Server** - Running and accessible
2. **GitHub Repository** - Your project repository
3. **Jenkins GitHub Plugin** - Installed on Jenkins
4. **Public Jenkins URL** - Jenkins must be accessible from GitHub

## Step 1: Install Required Jenkins Plugins

In Jenkins, go to **Manage Jenkins** → **Manage Plugins** and install:

- ✅ **GitHub Plugin** - Core GitHub integration
- ✅ **GitHub Branch Source Plugin** - Branch-based builds
- ✅ **Pipeline Plugin** - For Jenkinsfile support
- ✅ **Git Plugin** - Git integration

## Step 2: Configure GitHub Integration in Jenkins

1. Go to **Manage Jenkins** → **Configure System**
2. Scroll down to **GitHub** section
3. Add GitHub Server:
   - **Name**: `GitHub`
   - **API URL**: `https://api.github.com`
   - **Credentials**: Add your GitHub token (see Step 3)

## Step 3: Create GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `admin:repo_hook` (Full control of repository hooks)
4. Copy the token and save it securely

## Step 4: Add GitHub Credentials to Jenkins

1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click **Add Credentials**
3. Select **Secret text**
4. **Secret**: Paste your GitHub token
5. **ID**: `github-token`
6. **Description**: `GitHub Personal Access Token`

## Step 5: Configure GitHub Webhook

### Option A: Automatic Setup (Recommended)

1. In Jenkins, create a new **Pipeline** job
2. In **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your GitHub repository URL
   - **Credentials**: Add your GitHub credentials
   - **Branch Specifier**: `*/main` (or your main branch)
   - **Script Path**: `Jenkinsfile`

3. In **Build Triggers** section:
   - ✅ **GitHub hook trigger for GITScm polling**

4. Click **Save**

### Option B: Manual Webhook Setup

1. Go to your GitHub repository → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Configure:
   - **Payload URL**: `https://your-jenkins-server.com/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: (optional, but recommended)
   - **Events**: Select **Just the push event**
   - ✅ **Active**

4. Click **Add webhook**

## Step 6: Test the Integration

1. **Make a small change** to your code
2. **Commit and push** to your repository:
   ```bash
   git add .
   git commit -m "Test Jenkins webhook integration"
   git push origin main
   ```
3. **Check Jenkins** - A new build should start automatically
4. **Monitor the build** - Watch the console output

## Step 7: Verify Webhook is Working

### In Jenkins:
- Go to your job → **Build History**
- You should see a new build triggered by the push
- Check the build logs for Git information

### In GitHub:
- Go to **Settings** → **Webhooks**
- Click on your webhook
- Check **Recent Deliveries** tab
- Look for successful deliveries (green checkmarks)

## Troubleshooting

### Webhook Not Triggering

1. **Check Jenkins URL**: Ensure Jenkins is accessible from GitHub
2. **Verify Webhook URL**: Should be `https://your-jenkins-server.com/github-webhook/`
3. **Check Jenkins Logs**: Look for webhook delivery errors
4. **Test Webhook**: Use GitHub's "Redeliver" feature

### Build Not Starting

1. **Check Job Configuration**: Ensure webhook trigger is enabled
2. **Verify Repository URL**: Must match exactly
3. **Check Credentials**: GitHub token must have correct permissions
4. **Review Jenkins Logs**: Look for authentication errors

### Common Issues

- **SSL Certificate**: GitHub requires HTTPS for webhooks
- **Firewall**: Ensure Jenkins port is accessible
- **GitHub Token**: Must have `repo` and `admin:repo_hook` scopes
- **Branch Names**: Ensure branch names match in Jenkins configuration

## Expected Behavior

When you push to your repository, Jenkins will:

1. ✅ **Detect the push** via webhook
2. ✅ **Start a new build** automatically
3. ✅ **Checkout the latest code**
4. ✅ **Run the complete pipeline**:
   - Setup Node.js
   - Install dependencies
   - Build Next.js app
   - Start application
   - Run Selenium tests
   - Generate reports
5. ✅ **Archive test results** and screenshots
6. ✅ **Send notifications** (if configured)

## Pipeline Features

Your Jenkinsfile includes:

- 🔄 **Automatic triggering** on GitHub pushes
- 📊 **Git information collection** (commit, author, message)
- 🧪 **Comprehensive Selenium testing**
- 📸 **Screenshot capture** on test failures
- 📋 **Detailed reporting** with Git context
- 🏷️ **Branch detection** (main vs feature branches)

## Next Steps

1. **Set up notifications** (email, Slack, etc.)
2. **Configure build badges** for your README
3. **Set up deployment** for successful builds
4. **Add more test environments** (staging, production)

Your Jenkins pipeline is now ready to automatically test every push to your GitHub repository! 🚀
