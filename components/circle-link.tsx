interface props {
	url: string;
	text: string;
}

export const CircleLink: React.FC<props> = ({ url, text }) => {
	return (
		<a href={url} target="_blank" rel="noreferrer">
			{text}
		</a>
	);
};
