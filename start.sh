#!/bin/bash

source ./functions.sh

echo "Starting deployment..."
echo ""
echo "Checking your AWS login..."

if [ -z "$AWS_PROFILE" ]; then
    exit_on_error "No aws profile set. Please export the aws profile with the following command: export AWS_PROFILE=<your profile>"
fi

aws sts get-caller-identity 2> /dev/null || exit_on_error "Invalid AWS credentials. Please connect with AWS and export the correct AWS_PROFILE in your command line"

echo "Using the following credentials to enter exxeta references: ${BID_USERNAME} / ${BID_PASSWORD}"

pushd app
    echo -n "Deploying... "
    npm i --silent
    npx cdk bootstrap
    npx cdk synth
    npx cdk deploy --require-approval never
    echo "✅"
popd

# Final output
echo ""
echo ""
echo "✅ Deployment finished."


