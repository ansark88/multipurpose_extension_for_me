import type { CircleInfo, CreateUserBody } from "@/model/circle_model";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
	// to content
	getCircleInfo(): CircleInfo;
	isCircleMS(): boolean;

	// to background
	createUser(body: CreateUserBody): boolean;
}

export const { sendMessage, onMessage } =
	defineExtensionMessaging<ProtocolMap>();
