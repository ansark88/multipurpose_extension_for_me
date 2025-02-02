import type { Platform } from "douhin_extraction";

export type Link = {
	href: string;
	text: string;
	service: Platform | undefined; //Todo: 使う型はPlatformじゃなくてPlatformIdのほうがいいかも
};

export type CircleInfo = {
	circleName: string;
	links: Link[];
};

export type CreateUserBody = {
	name: string;
	melonbooksId: string | null;
	fanzaId: string | null;
	dlsiteId: string | null;
	twitterId: string | null;
	pixivId: string | null;
};
