export const RELATED_PAGE_RULES_KEY = "relatedPageRules";

export type RelatedLink = {
	url: string;
	label: string;
};

export type RelatedPageRule = {
	domain: string;
	links: RelatedLink[];
};
