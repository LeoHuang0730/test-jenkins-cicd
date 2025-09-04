pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Generate PR Report') {
            steps {
                script {
                    def currentTime = new Date().format("yyyy-MM-dd HH:mm:ss")
                    def buildNumber = env.BUILD_NUMBER ?: 'unknown'
                    def buildUrl = env.BUILD_URL ?: 'unknown'
                    def gitUrl = env.GIT_URL ?: 'unknown'
                    def gitBranch = env.GIT_BRANCH ?: 'unknown'
                    def gitCommit = env.GIT_COMMIT ?: 'unknown'
                    
                    // Check if this is triggered by a pull request
                    def isPR = env.GIT_BRANCH && env.GIT_BRANCH.contains('PR-')
                    
                    def reportContent = """Pull Request Event Report
=====================================
Event Time: ${currentTime}
Jenkins Build: #${buildNumber}
Build URL: ${buildUrl}
Repository: ${gitUrl}
Branch: ${gitBranch}
Commit: ${gitCommit}
Is Pull Request: ${isPR}
====================================="""
                    
                    // Write the report to a file with timestamp
                    def fileName = "pr_report_${currentTime.format('yyyyMMdd_HHmmss')}.txt"
                    writeFile file: fileName, text: reportContent
                    
                    // Also create a latest report
                    writeFile file: "latest_pr_report.txt", text: reportContent
                    
                    echo "Pull request report generated: ${fileName}"
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
            echo "Build completed with result: ${currentBuild.result}"
        }
        success {
            echo "Report generation completed successfully"
        }
        failure {
            echo "Failed to generate report"
        }
    }
}
