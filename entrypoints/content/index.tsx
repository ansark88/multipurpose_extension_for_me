import { getPlatformByDomain } from "douhin_extraction";
import { onMessage } from "../messaging/messaging.ts";
import type { CircleInfo, Link } from "@/model/circle_model.ts";

onMessage("isCircleMS", () => {
	return location.href.includes("circle.ms");
});

onMessage("getCircleInfo", () => {
	const nameEl = document
		.getElementsByClassName("item")[0]
		.querySelector(
			"table.md-itemtable:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)",
		);

	const info: CircleInfo = {
		circleName: nameEl?.textContent || "",
		links: extractLinks(),
	};

	return info;
});

// ページのリンク一覧から対象ドメインにマッチするものだけ抽出
const extractLinks = (): Link[] => {
	const links = Array.from(
		document.getElementsByClassName("item")[0].getElementsByTagName("a"),
	);

	return links.flatMap((link) => {
		try {
			const url = new URL(link.href);
			const service = getPlatformByDomain(url.hostname);
			if (!service) return [];
			return [
				{
					service,
					href: link.href,
					text: link?.textContent?.trim() || link.href,
				},
			];
		} catch (e) {
			console.log(e);
			return [];
		}
	});
};

// 最初に実行される
export default defineContentScript({
	matches: ["*://*/*"],
	main() {},
});
