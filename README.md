pipeline {
    agent any
    tools {
        jdk 'jdk-17'
        maven 'maven-3.9.15'
    }
    environment {
        MAVEN_OPTS = "-Dmaven.test.failure.ignore=true"
    }
    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/spring-projects/spring-petclinic.git', branch: 'main'
            }
        }
        stage('Build with Maven') {
            steps {
                bat 'mvn clean compile'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'mvn test'
            }
        }
        stage('Archive Test Results') {
            steps {
                junit 'target/surefire-reports/*.xml'
            }
        }
        stage('Package App') {
            steps {
                bat 'mvn package'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }
    }
    post {
        success {
            echo "Build and tests succeeded."
        }
        failure {
            echo "Build or tests failed."
        }
    }
}

Productivity Dashboard
Includes all rounded project of To-do-list, Journal, Expense tracker, Mood calender, Event scheduler, Menstrual cycle tracker, Password vault
