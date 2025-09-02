import { NextResponse } from "next/server";
import { getS3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET || "uploader-briefly";

export async function POST(request) {
	try {
		const { filename, contentType } = await request.json();
		if (!filename) {
			return NextResponse.json({ error: "filename is required" }, { status: 400 });
		}

		const key = `uploads/${Date.now()}-${filename}`;
		const command = new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			ContentType: contentType || "application/octet-stream",
		});

		const s3 = getS3Client();
		const url = await getSignedUrl(s3, command, { expiresIn: 60 });

		return NextResponse.json({ url, key, bucket: BUCKET });
	} catch (error) {
		console.error("presign error", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
} 