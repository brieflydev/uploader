"use client";

import { useEffect, useState } from "react";

export default function DownloadsPage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function load() {
			try {
				const res = await fetch("/api/downloads", { cache: "no-store" });
				if (!res.ok) throw new Error("Failed to fetch downloads");
				const data = await res.json();
				setItems(data.items || []);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
	if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;

	return (
		<div style={{ padding: 24 }}>
			<h1>Processed Downloads</h1>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 16,
				}}
			>
				{items.map((item) => (
					<div key={item.key} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 8 }}>
						<div style={{ aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 6, marginBottom: 8 }}>
							<img src={item.url} alt={item.key} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
						</div>
						<div style={{ fontSize: 12, color: "#555" }}>{item.key}</div>
						<div style={{ marginTop: 4 }}>
							<a href={item.url} target="_blank" rel="noreferrer">Open</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
} 