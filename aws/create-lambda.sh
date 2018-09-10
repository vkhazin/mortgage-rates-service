#/bin/bash

functionName=$1

sudo yum install -y zip && \
  npm install \
  && zip deployment.zip -r * -x *.git* \
  && lambda_execution_role_arn=$(aws iam get-role --role-name 'lambda_basic_execution' --query 'Role.Arn' --output text) \
  && aws lambda create-function \
      --function-name $functionName \
      --role "$lambda_execution_role_arn" \
      --zip-file fileb://deployment.zip \
      --handler index.handler \
      --runtime nodejs8.10 \
      --timeout 50 \
  && rm deployment.zip