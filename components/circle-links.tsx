import type { Link } from "@/model/circle_model";
import { CircleLink } from "./circle-link";

interface CircleLinksProps {
	links: Link[];
}

export const CircleLinks: React.FC<CircleLinksProps> = ({ links }) => {
	const listItems = links.map((link) => (
		<li key={link.href}>
			<CircleLink url={link.href} text={link.text} />
		</li>
	));

	return <ul>{listItems}</ul>;
};
