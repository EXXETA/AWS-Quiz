import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Runtime, Function, Code, AssetCode } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { Construct, Stack, StackProps, RemovalPolicy, CfnOutput } from '@aws-cdk/core';
import * as path from 'path';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const deProxyFunction = new Function(this, 'exxeta-deproxy-function', {
      runtime: Runtime.NODEJS_14_X,
      code: new AssetCode('../lambda/dist'),
      handler: 'handler.handler',
      environment: {
        API_ENDPOINT: `https://nexus.exxeta.info/repository/exxeta-raw-group/exxeta/aws-bids/${process.env.QUIZ_USERNAME || ''}/${process.env.QUIZ_FILE_DE}.json`,
        API_USER: process.env.QUIZ_USERNAME || '',
        API_PASSWORD: process.env.QUIZ_PASSWORD || '',
      }
    });
    const enProxyFunction = new Function(this, 'exxeta-enproxy-function', {
      runtime: Runtime.NODEJS_14_X,
      code: new AssetCode('../lambda/dist'),
      handler: 'handler.handler',
      environment: {
        API_ENDPOINT: `https://nexus.exxeta.info/repository/exxeta-raw-group/exxeta/aws-bids/${process.env.QUIZ_USERNAME || ''}/${process.env.QUIZ_FILE_EN}.json`,
        API_USER: process.env.QUIZ_USERNAME || '',
        API_PASSWORD: process.env.QUIZ_PASSWORD || '',
      }
    });

    const apiGateway = new HttpApi(this, 'exxeta-api');

    const deLambdaIntegration = new HttpLambdaIntegration('exxeta-deproxy-integration', deProxyFunction);
    const enLambdaIntegration = new HttpLambdaIntegration('exxeta-enproxy-integration', enProxyFunction);

    apiGateway.addRoutes({
      integration: deLambdaIntegration,
      path: '/de',
      methods: [HttpMethod.GET],
    });

    apiGateway.addRoutes({
      integration: enLambdaIntegration,
      path: '/en',
      methods: [HttpMethod.GET],
    });

    new CfnOutput(this, `api-gw-endpoint`, {
      exportName: `exxeta-aws-quiz${process.env.QUIZ_SUFFIX || ''}-endpoint`,
      value: apiGateway.apiEndpoint,
    });
  }
}

