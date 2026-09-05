import app from "./app";
import config from "./app/config/index";

const port = Number(config.port) || 5000;

app.listen(port, () => {
	console.log(`Daan Backend is running on port ${port}`);
});
