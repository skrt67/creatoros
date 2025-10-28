# Vidova Deployment Guide

This guide covers deploying Vidova to production environments.

## 🏗️ Architecture Overview

```
Internet → Vercel (Frontend) → AWS ALB → ECS Fargate (Backend) → RDS PostgreSQL
                                    ↓
                              Temporal Cluster
```

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as the root

2. **Configure Build Settings**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Push to main branch
   - Vercel will automatically deploy
   - Custom domain can be configured in Vercel settings

### Vercel Configuration

The `vercel.json` file includes:
- Security headers
- API proxy configuration
- Build optimization settings

## 🐳 Backend Deployment (AWS ECS/Fargate)

### Prerequisites
- AWS Account with appropriate permissions
- Docker installed locally
- AWS CLI configured

### 1. Database Setup (RDS)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier creatorOS-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --storage-encrypted
```

### 2. Container Registry (ECR)

```bash
# Create ECR repository
aws ecr create-repository --repository-name creatorOS-api

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push image
docker build -t creatorOS-api ./backend
docker tag creatorOS-api:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/creatorOS-api:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/creatorOS-api:latest
```

### 3. ECS Cluster Setup

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name creatorOS-prod
```

### 4. Task Definition

Create `task-definition.json`:

```json
{
  "family": "creatorOS-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/creatorOS-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:PASSWORD@your-rds-endpoint:5432/creatorOS"
        },
        {
          "name": "TEMPORAL_SERVER_URL",
          "value": "your-temporal-endpoint:7233"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT:secret:creatorOS/jwt-secret"
        },
        {
          "name": "ASSEMBLYAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT:secret:creatorOS/assemblyai-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/creatorOS-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register the task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 5. Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name creatorOS-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxxx

# Create target group
aws elbv2 create-target-group \
  --name creatorOS-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxxxxxx \
  --target-type ip \
  --health-check-path /health
```

### 6. ECS Service

```bash
aws ecs create-service \
  --cluster creatorOS-prod \
  --service-name creatorOS-api-service \
  --task-definition creatorOS-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:YOUR_ACCOUNT:targetgroup/creatorOS-targets/xxxxxxxxx,containerName=api,containerPort=8000
```

## ⚡ Temporal Deployment

### Option 1: Temporal Cloud (Recommended)
- Sign up for [Temporal Cloud](https://temporal.io/cloud)
- Create a namespace
- Get connection details
- Update `TEMPORAL_SERVER_URL` in your environment

### Option 2: Self-Hosted Temporal

Deploy Temporal using Helm:

```bash
# Add Temporal Helm repo
helm repo add temporalio https://go.temporal.io/helm-charts
helm repo update

# Install Temporal
helm install temporal temporalio/temporal \
  --set server.replicaCount=1 \
  --set cassandra.config.cluster_size=1 \
  --set prometheus.enabled=false \
  --set grafana.enabled=false \
  --set elasticsearch.enabled=false
```

## 🔐 Security Configuration

### 1. Secrets Management (AWS Secrets Manager)

```bash
# Store JWT secret
aws secretsmanager create-secret \
  --name "creatorOS/jwt-secret" \
  --description "JWT secret for Vidova" \
  --secret-string "your-super-secure-jwt-secret"

# Store AssemblyAI API key
aws secretsmanager create-secret \
  --name "creatorOS/assemblyai-key" \
  --description "AssemblyAI API key" \
  --secret-string "your-assemblyai-api-key"
```

### 2. IAM Roles

Create task execution role:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Security Groups

API Security Group:
- Inbound: Port 8000 from ALB security group
- Outbound: All traffic

Database Security Group:
- Inbound: Port 5432 from API security group
- Outbound: None

## 📊 Monitoring & Logging

### 1. CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/creatorOS-api
```

### 2. CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "creatorOS-high-cpu" \
  --alarm-description "High CPU utilization" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 3. Health Checks

The application includes:
- `/health` endpoint for basic health checks
- Database connectivity checks
- Temporal connectivity checks

## 🚀 Deployment Automation

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: creatorOS-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster creatorOS-prod \
            --service creatorOS-api-service \
            --force-new-deployment
```

## 🔄 Database Migrations

For production deployments:

```bash
# Run migrations
prisma db push --accept-data-loss

# Or use migrate for production
prisma migrate deploy
```

## 📈 Scaling

### Auto Scaling

```bash
# Create auto scaling target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/creatorOS-prod/creatorOS-api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/creatorOS-prod/creatorOS-api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name creatorOS-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

### Temporal Workers

Scale Temporal workers based on queue depth:

```bash
# Separate worker service
aws ecs create-service \
  --cluster creatorOS-prod \
  --service-name creatorOS-worker-service \
  --task-definition creatorOS-worker:1 \
  --desired-count 3 \
  --launch-type FARGATE
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check security groups
   - Verify connection string
   - Check RDS instance status

2. **Temporal Connection Issues**
   - Verify Temporal server endpoint
   - Check network connectivity
   - Review Temporal server logs

3. **High Memory Usage**
   - Monitor CloudWatch metrics
   - Adjust task memory allocation
   - Check for memory leaks

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster creatorOS-prod --services creatorOS-api-service

# View logs
aws logs tail /ecs/creatorOS-api --follow

# Check task health
aws ecs describe-tasks --cluster creatorOS-prod --tasks TASK_ARN
```

## 📋 Production Checklist

- [ ] Database backups configured
- [ ] SSL certificates installed
- [ ] Environment variables secured
- [ ] Monitoring and alerting set up
- [ ] Auto-scaling configured
- [ ] Health checks working
- [ ] Logs aggregation configured
- [ ] Security groups properly configured
- [ ] Secrets stored in AWS Secrets Manager
- [ ] CI/CD pipeline tested
- [ ] Disaster recovery plan documented

---

This deployment guide provides a production-ready setup for Vidova. Adjust configurations based on your specific requirements and scale.
