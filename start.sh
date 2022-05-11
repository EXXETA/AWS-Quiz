#!/bin/bash

source ./functions.sh

echo "Starting deployment..."
echo ""
echo "Checking your AWS login..."

if [ -z "$AWS_PROFILE" ]; then
    exit_on_error "No aws profile set. Please export the aws profile with the following command: export AWS_PROFILE=<your profile>"
fi

aws sts get-caller-identity 2> /dev/null || exit_on_error "Invalid AWS credentials. Please connect with AWS and export the correct AWS_PROFILE in your command line"

echo "Using the following credentials to enter exxeta references: ${QUIZ_USERNAME} / ${QUIZ_PASSWORD}"

pushd app
    echo -n "Deploying... "
    npm i --silent
    npx cdk bootstrap
    npx cdk synth
    npx cdk deploy --require-approval never
    echo "✅"
popd

API_ENDPOINT="$(aws cloudformation list-exports --region=eu-central-1 |jq -r --arg NAME "exxeta-aws-quiz${QUIZ_SUFFIX}-endpoint" '.Exports[] | select(.Name == $NAME) | .Value')"

pushd generator
    echo -n "Generating the QR Code..."
    npm i --silent
    node index.js "${API_ENDPOINT}/de"
    echo "✅ QR Code generated"
popd

# Final output
echo ""
echo ""
echo "✅ Deployment finished."


