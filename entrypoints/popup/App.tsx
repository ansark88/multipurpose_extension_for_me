import "./App.css";
import { CircleLinks } from "@/components/circle-links";
import { useCircleExtraction } from "./useCircleExtraction";
import { useRelatedPages } from "./useRelatedPages";

function App() {
	const { result, circleInfo, extractLinks, copyLinksSummary, sendApp } =
		useCircleExtraction();
	const { relatedLinks } = useRelatedPages();

	return (
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
				<button
					type="button"
					id="post_dj"
					hidden={!circleInfo}
					onClick={sendApp}
				>
					Appに送信
				</button>
			</div>

			<div id="links" className="link-item">
				{circleInfo && circleInfo.links.length > 0 && (
					<CircleLinks links={circleInfo.links} />
				)}
			</div>

			{relatedLinks.length > 0 && (
				<div id="related-pages">
					<h3>関連ページ</h3>
					<ul>
						{relatedLinks.map((link) => (
							<li key={link.url} className="link-item">
								<a href={link.url} target="_blank" rel="noreferrer">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default App;
