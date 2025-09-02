import { NextResponse } from "next/server";
import { getS3Client } from "@/lib/s3";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.DOWNLOADS_BUCKET || "uploader-downloads-briefly";

export async function GET() {
	try {
		const s3 = getS3Client();
		const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "watermarked/" }));
		const objects = list.Contents?.filter((o) => !o.Key.endsWith("/")) || [];

		const items = await Promise.all(
			objects.map(async (o) => {
				const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: o.Key }), { expiresIn: 300 });
				return {
					key: o.Key,
					size: o.Size,
					lastModified: o.LastModified,
					url,
				};
			})
		);

		return NextResponse.json({ bucket: BUCKET, items });
	} catch (err) {
		console.error("downloads list error", err);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
} 