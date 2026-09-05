// import path from "path";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
};
