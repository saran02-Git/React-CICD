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
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('node-ci-demo') {
                    sh 'npm install'
                }
            }
        }

        stage('Test (optional)') {
            steps {
                dir('node-ci-demo') {
                    sh '''
                        if grep -q '"test"' package.json; then
                          npm test
                        else
                          echo "No tests, skipping"
                        fi
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    mkdir -p "$APP_DIR"

                    rsync -a --delete ./node-ci-demo/ "$APP_DIR/"

                    cd "$APP_DIR"

                    # kill old app
                    if pgrep -f "node index.js" > /dev/null; then
                      pkill -f "node index.js"
                    fi

                    # start app
                    JENKINS_NODE_COOKIE=dontKillMe nohup env PORT=$APP_PORT NODE_ENV=$NODE_ENV node index.js > app.log 2>&1 &
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    sleep 5
                    curl -f http://localhost:$APP_PORT || exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "SUCCESS ✅ App running on port 3000"
        }
        failure {
            echo "FAILED ❌ Check logs"
        }
    }
}