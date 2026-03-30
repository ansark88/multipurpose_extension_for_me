interface CircleLinkProps {
	url: string;
	text: string;
}

export const CircleLink: React.FC<CircleLinkProps> = ({ url, text }) => {
	return (
		<a href={url} target="_blank" rel="noreferrer">
			{text}
		</a>
	);
};
