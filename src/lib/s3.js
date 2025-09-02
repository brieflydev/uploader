import { S3Client } from "@aws-sdk/client-s3";

let cachedClient;

export function getS3Client() {
	if (cachedClient) return cachedClient;
	cachedClient = new S3Client({
		region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
	});
	return cachedClient;
} 