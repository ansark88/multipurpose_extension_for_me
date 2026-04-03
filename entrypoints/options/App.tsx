import { useEffect, useState } from "react";
import type { RelatedLink, RelatedPageRule } from "@/model/related_pages_model";
import { RELATED_PAGE_RULES_KEY } from "@/model/related_pages_model";

async function loadRules(): Promise<RelatedPageRule[]> {
	const result = await browser.storage.local.get(RELATED_PAGE_RULES_KEY);
	const data = result[RELATED_PAGE_RULES_KEY];
	return Array.isArray(data) ? data : [];
}

async function saveRules(rules: RelatedPageRule[]): Promise<void> {
	await browser.storage.local.set({ [RELATED_PAGE_RULES_KEY]: rules });
}

function isValidUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" || parsed.protocol === "http:";
	} catch {
		return false;
	}
}

function isValidDomain(domain: string): boolean {
	try {
		return new URL(`https://${domain}`).hostname === domain;
	} catch {
		return false;
	}
}

function App() {
	const [rules, setRules] = useState<RelatedPageRule[]>([]);
	const [newDomain, setNewDomain] = useState("");
	const [error, setError] = useState("");
	const [newLinkInputs, setNewLinkInputs] = useState<
		Record<string, { label: string; url: string }>
	>({});

	useEffect(() => {
		loadRules().then(setRules);
	}, []);

	async function updateAndSave(updated: RelatedPageRule[]) {
		try {
			await saveRules(updated);
			setRules(updated);
			setError("");
		} catch (e) {
			console.error("ルールの保存に失敗しました:", e);
			setError("保存に失敗しました");
		}
	}

	function addDomain() {
		const domain = newDomain.trim();
		if (!domain || !isValidDomain(domain)) return;
		if (rules.some((r) => r.domain === domain)) return;
		updateAndSave([...rules, { domain, links: [] }]);
		setNewDomain("");
	}

	function removeDomain(domain: string) {
		updateAndSave(rules.filter((r) => r.domain !== domain));
	}

	function addLink(domain: string) {
		const input = newLinkInputs[domain];
		if (!input?.label.trim() || !input?.url.trim()) return;
		if (!isValidUrl(input.url.trim())) return;
		const updated = rules.map((r) => {
			if (r.domain !== domain) return r;
			const newLink: RelatedLink = {
				label: input.label.trim(),
				url: input.url.trim(),
			};
			return { ...r, links: [...r.links, newLink] };
		});
		updateAndSave(updated);
		setNewLinkInputs((prev) => ({
			...prev,
			[domain]: { label: "", url: "" },
		}));
	}

	function removeLink(domain: string, url: string) {
		const updated = rules.map((r) => {
			if (r.domain !== domain) return r;
			return { ...r, links: r.links.filter((l) => l.url !== url) };
		});
		updateAndSave(updated);
	}

	function updateLinkInput(
		domain: string,
		field: "label" | "url",
		value: string,
	) {
		setNewLinkInputs((prev) => ({
			...prev,
			[domain]: { ...prev[domain], [field]: value },
		}));
	}

	return (
		<div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
			<h1>関連ページ設定</h1>

			{error && <p style={{ color: "red" }}>{error}</p>}

			{rules.map((rule) => (
				<div
					key={rule.domain}
					style={{
						border: "1px solid #ccc",
						borderRadius: "4px",
						padding: "12px",
						marginBottom: "12px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<strong>{rule.domain}</strong>
						<button
							type="button"
							onClick={() => removeDomain(rule.domain)}
						>
							ドメインを削除
						</button>
					</div>

					<ul style={{ paddingLeft: "16px" }}>
						{rule.links.map((link) => (
							<li
								key={link.url}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "4px",
								}}
							>
								<span>
									{link.label} — {link.url}
								</span>
								<button
									type="button"
									onClick={() =>
										removeLink(rule.domain, link.url)
									}
								>
									削除
								</button>
							</li>
						))}
					</ul>

					<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
						<input
							type="text"
							placeholder="ラベル"
							value={newLinkInputs[rule.domain]?.label ?? ""}
							onChange={(e) =>
								updateLinkInput(rule.domain, "label", e.target.value)
							}
						/>
						<input
							type="url"
							placeholder="URL"
							value={newLinkInputs[rule.domain]?.url ?? ""}
							onChange={(e) =>
								updateLinkInput(rule.domain, "url", e.target.value)
							}
						/>
						<button type="button" onClick={() => addLink(rule.domain)}>
							追加
						</button>
					</div>
				</div>
			))}

			<div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
				<input
					type="text"
					placeholder="example.com"
					value={newDomain}
					onChange={(e) => setNewDomain(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addDomain()}
				/>
				<button type="button" onClick={addDomain}>
					ドメインを追加
				</button>
			</div>
		</div>
	);
}

export default App;
