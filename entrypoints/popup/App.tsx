import "./App.css";
import { CircleLinks } from "@/components/circle-links";
import { useCircleExtraction } from "./useCircleExtraction";

function App() {
	const { result, circleInfo, extractLinks, copyLinksSummary, sendApp } =
		useCircleExtraction();

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
		</div>
	);
}

export default App;
