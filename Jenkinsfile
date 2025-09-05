pipeline {
    agent any
    
    // Trigger on GitHub push events and poll for changes
    triggers {
        githubPush()
        // pollSCM('* * * * *')
    }
    
    environment {
        NODE_VERSION = '18'
        TEST_BASE_URL = 'http://localhost:3000'
        HEADLESS = 'true'
        CI = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Display Git information
                    def gitCommit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    def gitBranch = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    def gitAuthor = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
                    def gitMessage = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                    
                    echo "🔍 Git Information:"
                    echo "  Branch: ${gitBranch}"
                    echo "  Commit: ${gitCommit}"
                    echo "  Author: ${gitAuthor}"
                    echo "  Message: ${gitMessage}"
                    
                    // Check if this is a push to main/master branch
                    def isMainBranch = gitBranch == 'main' || gitBranch == 'master'
                    echo "  Is Main Branch: ${isMainBranch}"
                    
                    // Store Git info for later use
                    env.GIT_COMMIT_SHORT = gitCommit.take(7)
                    env.GIT_BRANCH_NAME = gitBranch
                    env.GIT_AUTHOR = gitAuthor
                    env.GIT_MESSAGE = gitMessage
                    env.IS_MAIN_BRANCH = isMainBranch.toString()
                }
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Check Node.js availability and provide helpful error messages
                    sh '''
                        echo "🔍 Checking Node.js installation..."
                        
                        if command -v node &> /dev/null; then
                            echo "✅ Node.js is already installed"
                            node --version
                            npm --version
                        else
                            echo "❌ Node.js is not installed on this Jenkins server"
                            echo "📋 Please install Node.js ${NODE_VERSION} on your Jenkins server:"
                            echo ""
                            echo "Option 1 - Using NodeSource repository:"
                            echo "  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -"
                            echo "  sudo apt-get install -y nodejs"
                            echo ""
                            echo "Option 2 - Using Jenkins NodeJS plugin:"
                            echo "  1. Go to Manage Jenkins → Manage Plugins"
                            echo "  2. Install 'NodeJS' plugin"
                            echo "  3. Go to Manage Jenkins → Global Tool Configuration"
                            echo "  4. Add NodeJS installation with version ${NODE_VERSION}"
                            echo ""
                            echo "Option 3 - Using Docker (if available):"
                            echo "  docker run --rm -v \$(pwd):/app -w /app node:${NODE_VERSION} npm ci"
                            echo ""
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('jenkins-selenium-integration') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Build Next.js App') {
            steps {
                dir('jenkins-selenium-integration') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Start Application') {
            steps {
                dir('jenkins-selenium-integration') {
                    script {
                        // Start the Next.js app in background
                        sh '''
                            nohup npm start > app.log 2>&1 &
                            echo $! > app.pid
                        '''
                        
                        // Wait for app to start
                        sh '''
                            echo "Waiting for application to start..."
                            for i in {1..30}; do
                                if curl -f http://localhost:3000 > /dev/null 2>&1; then
                                    echo "Application is ready!"
                                    break
                                fi
                                echo "Attempt $i: Application not ready yet..."
                                sleep 2
                            done
                        '''
                    }
                }
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                dir('jenkins-selenium-integration') {
                    script {
                        try {
                            // Verify Chrome is installed (should be installed on server)
                            sh '''
                                echo "🔍 Checking Chrome installation..."
                                if command -v google-chrome &> /dev/null; then
                                    echo "✅ Chrome is installed"
                                    google-chrome --version
                                else
                                    echo "❌ Chrome not found. Installing..."
                                    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
                                    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
                                    sudo apt-get update
                                    sudo apt-get install -y google-chrome-stable
                                fi
                                
                                echo "📋 ChromeDriver will be managed automatically by Selenium Manager"
                                echo "✅ No manual ChromeDriver installation needed"
                            '''
                            
                            // Run Selenium tests
                            sh 'npm run test:selenium'
                            
                        } catch (Exception e) {
                            echo "Selenium tests failed: ${e.getMessage()}"
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
            post {
                always {
                    dir('jenkins-selenium-integration') {
                        // Archive test results and screenshots
                        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        archiveArtifacts artifacts: 'app.log', allowEmptyArchive: true
                        
                        // Clean up
                        sh '''
                            if [ -f app.pid ]; then
                                kill $(cat app.pid) 2>/dev/null || true
                                rm -f app.pid
                            fi
                            pkill -f "npm start" || true
                        '''
                    }
                }
            }
        }
        
        stage('Generate Test Report') {
            steps {
                script {
                    def currentTime = new Date().format("yyyy-MM-dd HH:mm:ss")
                    def buildNumber = env.BUILD_NUMBER ?: 'unknown'
                    def buildUrl = env.BUILD_URL ?: 'unknown'
                    def gitUrl = env.GIT_URL ?: 'unknown'
                    
                    // Use the Git info we collected earlier
                    def gitBranch = env.GIT_BRANCH_NAME ?: 'unknown'
                    def gitCommit = env.GIT_COMMIT_SHORT ?: 'unknown'
                    def gitAuthor = env.GIT_AUTHOR ?: 'unknown'
                    def gitMessage = env.GIT_MESSAGE ?: 'unknown'
                    def isMainBranch = env.IS_MAIN_BRANCH ?: 'false'
                    
                    // Determine trigger type
                    def triggerType = 'Unknown'
                    if (env.GITHUB_EVENT_NAME) {
                        triggerType = "GitHub ${env.GITHUB_EVENT_NAME}"
                    } else if (env.GIT_BRANCH_NAME) {
                        triggerType = "Git Push to ${gitBranch}"
                    }
                    
                    def reportContent = """🚀 Jenkins CI/CD Pipeline Report
=====================================
Event Time: ${currentTime}
Trigger: ${triggerType}
Jenkins Build: #${buildNumber}
Build URL: ${buildUrl}
Repository: ${gitUrl}
Branch: ${gitBranch}
Commit: ${gitCommit}
Author: ${gitAuthor}
Message: ${gitMessage}
Is Main Branch: ${isMainBranch}
Pipeline Status: ${currentBuild.result ?: 'SUCCESS'}
Selenium Tests: ${currentBuild.result == 'UNSTABLE' ? 'FAILED' : 'PASSED'}
Test Results: ${currentBuild.result == 'UNSTABLE' ? '❌ Some tests failed' : '✅ All tests passed'}
====================================="""
                    
                    // Write the report to a file with timestamp
                    def fileName = "ci_report_${currentTime.format('yyyyMMdd_HHmmss')}.txt"
                    writeFile file: fileName, text: reportContent
                    
                    // Also create a latest report
                    writeFile file: "latest_ci_report.txt", text: reportContent
                    
                    echo "📊 CI/CD report generated: ${fileName}"
                    echo "📈 Pipeline Status: ${currentBuild.result ?: 'SUCCESS'}"
                }
            }
        }
        
        stage('Archive Reports') {
            steps {
                // Archive the generated files
                archiveArtifacts artifacts: "*.txt", fingerprint: true
                echo "Reports archived successfully"
            }
        }
    }
    
    post {
        always {
            echo "🏁 Build completed with result: ${currentBuild.result}"
            echo "📋 Git Info: ${env.GIT_BRANCH_NAME} - ${env.GIT_COMMIT_SHORT} by ${env.GIT_AUTHOR}"
        }
        success {
            echo "✅ Pipeline completed successfully!"
            echo "🎉 All Selenium tests passed for commit ${env.GIT_COMMIT_SHORT}"
        }
        failure {
            echo "❌ Pipeline failed!"
            echo "🔍 Check the logs for details about commit ${env.GIT_COMMIT_SHORT}"
        }
        unstable {
            echo "⚠️  Pipeline completed with warnings!"
            echo "🧪 Some Selenium tests failed for commit ${env.GIT_COMMIT_SHORT}"
        }
    }
}
