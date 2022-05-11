import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import axios from 'axios';

// Since we don't want sent all cors headers on our side, we provide this proxy for your application
const handler = async function (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    if (!process.env.API_ENDPOINT || !process.env.API_USER || !process.env.API_PASSWORD) {
        throw new Error('Environment variables are missing');
    }

    const data = await axios.get(process.env.API_ENDPOINT, {
        auth: {
            username: process.env.API_USER,
            password: process.env.API_PASSWORD,
        },
        timeout: 30000,
    });

    return {
        body: JSON.stringify(data.data),
        statusCode: 200,
    };
}

export { handler }