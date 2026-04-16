pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        APP_PORT = '3000'
        NODE_ENV = 'production'
        APP_DIR  = '/var/lib/jenkins/trend-cicd-app'
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
                sh '''
                    if [ -f package.json ] && cat package.json | grep -q '"test"'; then
                      npm test
                    else
                      echo "No test script defined, skipping tests"
                    fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    mkdir -p "$APP_DIR"

                    rsync -a --delete ./ "$APP_DIR/"

                    cd "$APP_DIR"

                    if pgrep -f "node index.js" > /dev/null 2>&1; then
                      pkill -f "node index.js"
                    fi

                    JENKINS_NODE_COOKIE=dontKillMe nohup env PORT="$APP_PORT" NODE_ENV="$NODE_ENV" node index.js > app.log 2>&1 &
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    curl -f "http://localhost:$APP_PORT" || (echo "Health check failed" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully. App is running on port 3000.'
        }
        failure {
            echo 'Pipeline failed. Check Console Output in Jenkins.'
        }
    }
}