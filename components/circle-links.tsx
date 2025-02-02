import type { Link } from "@/model/circle_model";
import { CircleLink } from "./circle-link";

interface props {
	links: Link[];
}

export const CircleLinks: React.FC<props> = ({ links }) => {
	const listItems = links.map((link) => (
		<li key={link.text}>
			<CircleLink url={link.href} text={link.text} />
		</li>
	));

	return <ul>{listItems}</ul>;
};
