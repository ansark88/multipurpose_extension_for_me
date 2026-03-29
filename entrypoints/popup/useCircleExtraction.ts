import { useState } from "react";
import { sendMessage } from "../messaging/messaging";
import {
	extractCircleID,
	type Platform,
	PlatformList,
} from "douhin_extraction";
import type { CircleInfo, CreateUserBody, Link } from "@/model/circle_model";

function filterCircleLink(link: Link): boolean {
	if (!link.service) {
		return false;
	}

	return !!extractCircleID(link.service, link.href);
}

export function useCircleExtraction() {
	const [result, setResult] = useState("");
	const [circleInfo, setCircleInfo] = useState<CircleInfo>();

	// Todo: circle.msだけじゃなくskeb,fantia,fanboxからリンクを取り出せるようにしたい
	const extractLinks = async () => {
		const activeTab = await browser.tabs.query({
			active: true,
			lastFocusedWindow: true,
		});

		const isCircleMS = await sendMessage(
			"isCircleMS",
			undefined,
			activeTab[0].id,
		);

		if (!isCircleMS) {
			setResult("circle.ms上で実行してください");
			return;
		}

		try {
			const info = await sendMessage(
				"getCircleInfo",
				undefined,
				activeTab[0].id,
			);
			info.links = info.links.filter((link) => filterCircleLink(link));

			if (info.links.length === 0) {
				setResult("該当するリンクが見つかりませんでした");
			}

			// ここまで残ったリンクはsummaryとして表示し、さらにAppに送信する元データとしても使う
			setCircleInfo(info);
		} catch (e) {
			console.log(e);
			setResult(`ページの解析中にエラー発生しました。${e}`);
		}
	};

	const copyLinksSummary = () => {
		navigator.clipboard.writeText(JSON.stringify(circleInfo));
	};

	const sendApp = async () => {
		if (circleInfo === undefined) {
			setResult("送信できるサークル情報がありません");
			return;
		}

		// keyをserviceとしたhashに変換
		const linkHash: Record<Platform, Link> = Object.fromEntries(
			circleInfo.links.map((item) => [item.service, item]),
		);

		const getID = (platform: Platform): string | null => {
			if (!Object.hasOwn(linkHash, platform)) {
				return null;
			}

			return extractCircleID(platform, linkHash[platform].href) || null;
		};

		const body: CreateUserBody = {
			name: circleInfo.circleName,
			melonbooksId: getID(PlatformList.melonbooks),
			fanzaId: getID(PlatformList.fanza),
			dlsiteId: getID(PlatformList.dlsite),
			twitterId: getID(PlatformList.twitter),
			pixivId: getID(PlatformList.pixiv),
		};

		console.log(body);

		const sendResult = await sendMessage("createUser", body);

		sendResult
			? setResult("Appへ送信しました")
			: setResult("Appへの送信エラーになりました");
	};

	return { result, circleInfo, extractLinks, copyLinksSummary, sendApp };
}
