import type { CreateUserBody } from "@/model/circle_model";
import { onMessage } from "../messaging/messaging";

function handleCreateUser(body: CreateUserBody) {
	// try {
	// 	const response = await fetch("http://localhost:3000/users", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(message.body),
	// 	});

	// 	const result = await response.json();
	// 	console.log("Response:", result);
	// 	return result;
	// } catch (error) {
	// 	console.error("Error:", error);
	// 	throw error;
	// }

	// Return an array of all responses back to popup.
	// return responses;
	return "";
}

onMessage("createUser", (message) => {
	handleCreateUser(message.data);
});

// 最初に実行される
export default defineBackground(() => {
	console.log("Hello background!", { id: browser.runtime.id });
});
