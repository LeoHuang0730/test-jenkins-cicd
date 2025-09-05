# Jenkins Server Setup Guide

This guide helps Jenkins administrators set up the server environment required for the Selenium testing pipeline.

## Prerequisites

Your Jenkins server needs the following software installed:

- ✅ **Node.js 18+** - For running the Next.js application
- ✅ **Google Chrome** - For Selenium WebDriver testing
- ✅ **Git** - For repository access
- ✅ **Java 11+** - For Jenkins itself

## Option 1: Install Node.js using NodeJS Plugin (Recommended)

### Step 1: Install NodeJS Plugin
1. Go to **Manage Jenkins** → **Manage Plugins**
2. Search for **"NodeJS"**
3. Install the **NodeJS** plugin
4. Restart Jenkins

### Step 2: Configure Node.js Installation
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll down to **NodeJS** section
3. Click **Add NodeJS**
4. Configure:
   - **Name**: `NodeJS-18`
   - **Install automatically**: ✅ Check this
   - **Version**: Select Node.js 18.x LTS
5. Click **Save**

### Step 3: Update Jenkinsfile (Optional)
If using the NodeJS plugin, you can update your Jenkinsfile to use the tool:

```groovy
stage('Setup Node.js') {
    steps {
        script {
            // Use Jenkins NodeJS tool
            def nodeHome = tool name: 'NodeJS-18', type: 'nodejs'
            env.PATH = "${nodeHome}/bin:${env.PATH}"
            
            sh '''
                echo "✅ Using Jenkins NodeJS tool"
                node --version
                npm --version
            '''
        }
    }
}
```

## Option 2: Manual Node.js Installation

### For Ubuntu/Debian:
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### For CentOS/RHEL:
```bash
# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

## Option 3: Install Chrome for Selenium

### For Ubuntu/Debian:
```bash
# Install Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Verify installation
google-chrome --version
```

### For CentOS/RHEL:
```bash
# Install Google Chrome
sudo tee /etc/yum.repos.d/google-chrome.repo <<EOF
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl.google.com/linux/linux_signing_key.pub
EOF

sudo yum install -y google-chrome-stable

# Verify installation
google-chrome --version
```

## Option 4: Docker-based Approach (Alternative)

If you prefer using Docker, you can modify the Jenkinsfile to use Docker containers:

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                dir('jenkins-selenium-integration') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Build and Test') {
            steps {
                dir('jenkins-selenium-integration') {
                    sh 'npm run build'
                    sh 'npm run test:selenium'
                }
            }
        }
    }
}
```

## Required Jenkins Plugins

Install these plugins in Jenkins:

### Core Plugins:
- ✅ **Git Plugin** - Git integration
- ✅ **Pipeline Plugin** - Pipeline support
- ✅ **GitHub Plugin** - GitHub integration
- ✅ **GitHub Branch Source Plugin** - Branch-based builds

### Optional but Recommended:
- ✅ **NodeJS Plugin** - Node.js tool management
- ✅ **Build Timeout Plugin** - Prevent hanging builds
- ✅ **Timestamper Plugin** - Add timestamps to logs
- ✅ **AnsiColor Plugin** - Colored console output

## Jenkins Configuration

### 1. Configure Git
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Find **Git** section
3. Set **Path to Git executable** (usually `/usr/bin/git`)
4. Click **Save**

### 2. Configure GitHub Integration
1. Go to **Manage Jenkins** → **Configure System**
2. Find **GitHub** section
3. Add GitHub Server:
   - **Name**: `GitHub`
   - **API URL**: `https://api.github.com`
   - **Credentials**: Add your GitHub token

### 3. Set Up Credentials
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Add credentials for:
   - **GitHub Personal Access Token**
   - **SSH Keys** (if using SSH)

## Testing the Setup

### 1. Create a Test Job
1. Create a new **Pipeline** job
2. Use this test pipeline:

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test Environment') {
            steps {
                sh '''
                    echo "🔍 Testing Jenkins Environment"
                    echo "Node.js version:"
                    node --version || echo "Node.js not found"
                    echo "NPM version:"
                    npm --version || echo "NPM not found"
                    echo "Chrome version:"
                    google-chrome --version || echo "Chrome not found"
                    echo "Git version:"
                    git --version || echo "Git not found"
                '''
            }
        }
    }
}
```

### 2. Run the Test
- Execute the test job
- Verify all tools are available
- Check for any missing dependencies

## Troubleshooting

### Node.js Not Found
- Verify Node.js is installed: `which node`
- Check PATH environment variable
- Restart Jenkins after installation

### Chrome Not Found
- Verify Chrome is installed: `which google-chrome`
- Check if Chrome is in PATH
- Install ChromeDriver if needed

### Permission Issues
- Ensure Jenkins user has necessary permissions
- Check file ownership and permissions
- Consider running Jenkins with appropriate user privileges

### Network Issues
- Verify internet connectivity
- Check firewall settings
- Ensure GitHub access is available

## Security Considerations

- Use **Personal Access Tokens** instead of passwords
- Limit token permissions to minimum required
- Regularly rotate credentials
- Use **HTTPS** for all connections
- Consider using **Jenkins Credentials** for sensitive data

## Performance Optimization

- Use **SSD storage** for Jenkins workspace
- Allocate sufficient **RAM** (minimum 4GB)
- Use **dedicated build agents** for heavy workloads
- Configure **build retention** policies
- Monitor **disk space** usage

Your Jenkins server should now be ready to run the Selenium testing pipeline! 🚀
