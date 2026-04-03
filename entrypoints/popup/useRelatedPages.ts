import { useEffect, useState } from "react";
import type { RelatedLink, RelatedPageRule } from "@/model/related_pages_model";
import { RELATED_PAGE_RULES_KEY } from "@/model/related_pages_model";

export function useRelatedPages() {
	const [relatedLinks, setRelatedLinks] = useState<RelatedLink[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const tabs = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});
				const url = tabs[0]?.url;
				if (!url) return;

				let hostname: string;
				try {
					hostname = new URL(url).hostname;
				} catch {
					return;
				}

				const result =
					await browser.storage.local.get(RELATED_PAGE_RULES_KEY);
				const data = result[RELATED_PAGE_RULES_KEY];
				if (!Array.isArray(data)) return;
				const rules = data as RelatedPageRule[];
				const matched = rules.find((r) => r.domain === hostname);
				if (matched) {
					setRelatedLinks(matched.links);
				}
			} catch (e) {
				console.error("関連ページの読み込みに失敗しました:", e);
			}
		})();
	}, []);

	return { relatedLinks };
}
