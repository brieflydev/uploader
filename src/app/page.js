"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState("");
	const [uploadedKey, setUploadedKey] = useState("");

	async function handleUpload(e) {
		e.preventDefault();
		if (!file) return;
		setStatus("Requesting upload URL...");
		setUploadedKey("");
		try {
			const res = await fetch("/api/presign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filename: file.name, contentType: file.type }),
			});
			if (!res.ok) throw new Error("Failed to get upload URL");
			const { url, key } = await res.json();

			setStatus("Uploading to S3...");
			const putRes = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": file.type || "application/octet-stream" },
				body: file,
			});
			if (!putRes.ok) throw new Error("Upload failed");

			setUploadedKey(key);
			setStatus("Upload complete!");
		} catch (err) {
			console.error(err);
			setStatus(`Error: ${err.message}`);
		}
	}

	return (
		<div style={{ padding: 24 }}>
			<h1>S3 Upload</h1>
			<p><Link href="/downloads">View processed downloads</Link></p>
			<form onSubmit={handleUpload}>
				<input
					type="file"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>
				<button type="submit" disabled={!file}>Upload</button>
			</form>
			{status && <p>{status}</p>}
			{uploadedKey && (
				<p>
					Uploaded to key: <code>{uploadedKey}</code>
				</p>
			)}
		</div>
	);
}
