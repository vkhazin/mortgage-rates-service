#/bin/bash
npm install \
  && zip deployment.zip -r ./ -x *.git* \
  && aws lambda update-function-code \
    --function-name $1 \
    --zip-file fileb://deployment.zip \
    --publish \
  && rm deployment.zip