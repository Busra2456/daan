import app from "./app";
import config from "./app/config/index";
import { connectRedis } from "./app/lib/redis";
const port = Number(config.port) || 5000;
const startServer = async () => {
    try {
        await connectRedis();
        app.listen(port, () => {
            console.log(`Daan Backend is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
