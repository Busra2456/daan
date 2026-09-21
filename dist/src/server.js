import app from "./app";
import config from "./app/config/index.js";
import { transporter } from "./app/lib/nodemailer";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";
const port = Number(config.port) || 5000;
const main = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
        await redisClient.connect();
        console.log("Redis Connected Successfully.");
        await transporter.verify();
        console.log("Nodemailer Connected Successfully.");
        app.listen(port, () => {
            console.log(`Daan Backend is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        await prisma.$disconnect();
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
        process.exit(1);
    }
};
main();
