import { createClient } from "redis";
import config from "../config/index.js";

export const redisClient = createClient({
	username: config.redis_user,
	password: config.redis_password,
	socket: {
		host: config.redis_host,
		port: Number(config.redis_port),
	},
});

redisClient.on("error", (error) => {
	console.error("Redis Client Error:", error);
});

if (!redisClient.isOpen) {
	redisClient.connect().catch((error) => {
		console.error("Redis connection failed:", error);
	});
}