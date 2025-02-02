import { useState } from "react";
import "./App.css";
import { sendMessage } from "../messaging/messaging";
import {
	extractCircleID,
	type Platform,
	PlatformList,
} from "douhin_extraction";
import type { CircleInfo, CreateUserBody, Link } from "@/model/circle_model";
import { CircleLinks } from "@/components/circle-links";

function App() {
	const [result, setResult] = useState("");
	const [circleInfo, setCircleInfo] = useState<CircleInfo>();

	// リンクの中でサークル情報に対するリンクのみ残す、サービス情報を付与する(それ以外のリンクは後でfilterする)
	const filterCircleLink = (link: Link): boolean => {
		if (!link.service) {
			return false;
		}

		const platform = link.service;
		const cicrleID = extractCircleID(platform, link.href);

		if (!cicrleID) {
			return false;
		}

		return true;
	};

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

		const getID = (platform: Platform) => {
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

		await sendMessage("createUser", body);
	};

	return (
		<>
			<div>
				<button type="button" id="extract" onClick={extractLinks}>
					生成
				</button>
				<textarea
					id="result_area"
					name="result_area"
					cols={30}
					rows={5}
					value={JSON.stringify(circleInfo)}
					readOnly
				/>

				{result && (
					<div id="result_message">
						<p>{result}</p>
					</div>
				)}
				<div>
					<button type="button" id="copy" onClick={copyLinksSummary}>
						コピー
					</button>
					<button type="button" id="post_dj" hidden={true} onClick={sendApp}>
						Appに送信
					</button>
				</div>

				<div id="links" className="link-item">
					{circleInfo && circleInfo.links.length > 0 && (
						<CircleLinks links={circleInfo.links} />
					)}
				</div>
			</div>
		</>
	);
}

export default App;
