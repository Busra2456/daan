import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./app/docs/swagger.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { AdminRoutes } from "./app/module/admin/admin.route.js";
import { AuthRoutes } from "./app/module/auth/auth.route.js";
import { CommunicationRoutes } from "./app/module/communication/communication.route.js";
import { DonationRoutes } from "./app/module/donation/donation.route.js";
import { DonationRequestRoutes } from "./app/module/donationRequest/donationRequest.route.js";
import { DonorRoutes } from "./app/module/donor/donor.route.js";
import { PaymentRoutes } from "./app/module/payment/payment.route.js";
import { UserRoutes } from "./app/module/user/user.route.js";
import { SSLCommerzRoutes } from "./app/module/payment/sslcommerz.route.js";

const app = express();
const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Daan Backend is running!",
	});
});


app.get("/api-docs", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Daan API Documentation</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
        />
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerSpec)},
              dom_id: "#swagger-ui",
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
              ],
              layout: "BaseLayout",
            });
          };
        </script>
      </body>
    </html>
  `);
});

app.use("/api/users", UserRoutes);
app.use("/api/auth",AuthRoutes);
app.use("/api/donation-requests", DonationRequestRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/donor", DonorRoutes);
app.use("/api/donations", DonationRoutes);
app.use("/api/communication", CommunicationRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/payment/sslcommerz",SSLCommerzRoutes);
app.use(globalErrorHandler);

export default app;
