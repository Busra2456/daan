import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Daan API",
            version: "1.0.0",
            description: "Daan - Donate with Trust. A verified platform connecting donors with people in need.",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],
        tags: [
            { name: "Authentication", description: "User authentication APIs" },
            {
                name: "Donation Requests",
                description: "Donation request APIs",
            },
            { name: "Admin", description: "Admin management APIs" },
            { name: "Donor", description: "Donor APIs" },
            { name: "Donations", description: "Donation APIs" },
            {
                name: "Communication",
                description: "Donor and needy communication APIs",
            },
            { name: "Payments", description: "bKash payment APIs" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        paths: {
            "/api/auth/register": {
                post: {
                    tags: ["Authentication"],
                    summary: "Register a new user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        email: {
                                            type: "string",
                                            format: "email",
                                        },
                                        password: {
                                            type: "string",
                                            format: "password",
                                        },
                                        role: {
                                            type: "string",
                                            enum: ["NEEDY", "DONOR"],
                                        },
                                    },
                                    required: ["name", "email", "password", "role"],
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "Registration successful" },
                        400: { description: "Validation error" },
                        409: { description: "User already exists" },
                    },
                },
            },
            "/api/auth/verify-email": {
                post: {
                    tags: ["Authentication"],
                    summary: "Verify user email with OTP",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                        otp: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Email verified successfully" },
                        400: { description: "Invalid or expired OTP" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Authentication"],
                    summary: "Login user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                        password: { type: "string" },
                                    },
                                    required: ["email", "password"],
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Login successful" },
                        401: { description: "Invalid credentials" },
                    },
                },
            },
            "/api/auth/google-login": {
                post: {
                    tags: ["Authentication"],
                    summary: "Login using Google",
                    responses: {
                        200: { description: "Google login successful" },
                        400: { description: "Invalid Google credentials" },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Authentication"],
                    summary: "Get current logged-in user",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Current user information" },
                        401: { description: "Unauthorized" },
                    },
                },
            },
            "/api/auth/forgot-password": {
                post: {
                    tags: ["Authentication"],
                    summary: "Request password reset OTP",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Password reset OTP sent" },
                    },
                },
            },
            "/api/auth/reset-password": {
                post: {
                    tags: ["Authentication"],
                    summary: "Reset password",
                    responses: {
                        200: { description: "Password reset successful" },
                        400: { description: "Invalid reset information" },
                    },
                },
            },
            "/api/auth/refresh-token": {
                post: {
                    tags: ["Authentication"],
                    summary: "Refresh access token",
                    responses: {
                        200: { description: "Token refreshed successfully" },
                        401: { description: "Invalid refresh token" },
                    },
                },
            },
            "/api/donation-requests": {
                post: {
                    tags: ["Donation Requests"],
                    summary: "Create a donation request",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        201: { description: "Donation request created" },
                        401: { description: "Unauthorized" },
                    },
                },
            },
            "/api/donation-requests/{requestId}": {
                get: {
                    tags: ["Donation Requests"],
                    summary: "Get donation request details",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "requestId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Donation request details" },
                        404: { description: "Donation request not found" },
                    },
                },
            },
            "/api/admin/donation-requests/pending": {
                get: {
                    tags: ["Admin"],
                    summary: "Get pending donation requests",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Pending donation requests" },
                        401: { description: "Unauthorized" },
                        403: { description: "Admin access required" },
                    },
                },
            },
            "/api/admin/donation-requests/{requestId}/verify": {
                patch: {
                    tags: ["Admin"],
                    summary: "Verify a donation request",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "requestId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Donation request verified" },
                    },
                },
            },
            "/api/admin/donation-requests/{requestId}/reject": {
                patch: {
                    tags: ["Admin"],
                    summary: "Reject a donation request",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "requestId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Donation request rejected" },
                    },
                },
            },
            "/api/donor/donation-requests": {
                get: {
                    tags: ["Donor"],
                    summary: "Get verified donation requests",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Verified donation requests" },
                    },
                },
            },
            "/api/donations": {
                post: {
                    tags: ["Donations"],
                    summary: "Create a donation",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        201: { description: "Donation created successfully" },
                    },
                },
            },
            "/api/donations/my-donations": {
                get: {
                    tags: ["Donations"],
                    summary: "Get my donations",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Donor donation history" },
                    },
                },
            },
            "/api/communication/requests/{requestId}": {
                post: {
                    tags: ["Communication"],
                    summary: "Create conversation for a donation request",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "requestId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        201: { description: "Conversation created" },
                    },
                },
            },
            "/api/communication/messages": {
                post: {
                    tags: ["Communication"],
                    summary: "Send a message",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        201: { description: "Message sent successfully" },
                    },
                },
            },
            "/api/communication/conversations/{conversationId}/messages": {
                get: {
                    tags: ["Communication"],
                    summary: "Get conversation messages",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "conversationId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Conversation messages" },
                    },
                },
            },
            "/api/payments/{donationId}/create": {
                post: {
                    tags: ["Payments"],
                    summary: "Create bKash payment",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "donationId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "bKash payment created" },
                    },
                },
            },
            "/api/payments/{donationId}/execute": {
                post: {
                    tags: ["Payments"],
                    summary: "Execute bKash payment",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "donationId",
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Payment executed successfully" },
                    },
                },
            },
            "/api/payments/bkash/callback": {
                get: {
                    tags: ["Payments"],
                    summary: "bKash payment callback",
                    parameters: [
                        {
                            name: "paymentID",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                        },
                        {
                            name: "status",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                        },
                    ],
                    responses: {
                        200: { description: "Payment callback received" },
                    },
                },
            },
        },
    },
    apis: [],
};
export const swaggerSpec = swaggerJsdoc(options);
