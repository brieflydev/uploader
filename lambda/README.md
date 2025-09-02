# Watermark Lambda (SQS -> S3)

This Lambda is triggered by SQS messages containing S3 event notifications for object uploads. It downloads the source image, adds a bottom-right watermark saying `briefly.dev`, and uploads the result to the `uploader-downloads-briefly` bucket (or `process.env.DEST_BUCKET`).

## Env Vars
- `DEST_BUCKET` (optional): Destination bucket. Defaults to `uploader-downloads-briefly`.
- `AWS_REGION` or `AWS_DEFAULT_REGION`: Region for AWS SDK.

## Build and Package (Jimp, no native deps)
```bash
cd lambda
rm -rf node_modules package-lock.json
npm ci
zip -r ../lambda.zip .
```
This produces `lambda.zip` in the project root. Upload it to your Lambda function.

## IAM
The Lambda execution role needs:
- Read from source upload bucket (e.g., `uploader-briefly`): `s3:GetObject`.
- Write to destination bucket: `s3:PutObject`.

## Trigger
- Your SQS queue receives `s3:ObjectCreated:*` notifications from the source bucket.
- Set the Lambda to trigger on that SQS queue. 