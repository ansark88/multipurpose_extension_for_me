import type { CreateUserBody } from "@/model/circle_model";
import { onMessage } from "../messaging/messaging";

async function handleCreateUser(body: CreateUserBody) {
	try {
		const response = await fetch("http://localhost:3000/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const result = await response.json();
		console.log("Response:", result);
		return true;
	} catch (error) {
		console.error("Error:", error);
		return false;
	}
}

onMessage("createUser", (message) => {
	// Todo: error handling
	return handleCreateUser(message.data);
});

// 最初に実行される
export default defineBackground(() => {
	console.log("Hello background!", { id: browser.runtime.id });
});
