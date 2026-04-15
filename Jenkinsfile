pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        APP_PORT = '4000'
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    if pgrep -f "node index.js" > /dev/null; then
                      pkill -f "node index.js"
                    fi

                    nohup env PORT=$APP_PORT NODE_ENV=$NODE_ENV node index.js > app.log 2>&1 &
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    curl -f http://localhost:$APP_PORT
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
        always {
            deleteDir()
        }
    }
}
