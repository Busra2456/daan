
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// src/app/docs/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Daan API",
      version: "1.0.0",
      description: "Daan - Donate with Trust. A verified platform connecting donors with people in need."
    },
    servers: [
      {
        url: "https://daan-7z6n.vercel.app",
        description: "Production server"
      },
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],
    tags: [
      { name: "Authentication", description: "User authentication APIs" },
      {
        name: "Donation Requests",
        description: "Donation request APIs"
      },
      { name: "Admin", description: "Admin management APIs" },
      { name: "Donor", description: "Donor APIs" },
      { name: "Donations", description: "Donation APIs" },
      {
        name: "Communication",
        description: "Donor and needy communication APIs"
      },
      { name: "Payments", description: "bKash payment APIs" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
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
                      format: "email"
                    },
                    password: {
                      type: "string",
                      format: "password"
                    },
                    role: {
                      type: "string",
                      enum: ["NEEDY", "DONOR"]
                    }
                  },
                  required: ["name", "email", "password", "role"]
                }
              }
            }
          },
          responses: {
            201: { description: "Registration successful" },
            400: { description: "Validation error" },
            409: { description: "User already exists" }
          }
        }
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
                    otp: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Email verified successfully" },
            400: { description: "Invalid or expired OTP" }
          }
        }
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
                    password: { type: "string" }
                  },
                  required: ["email", "password"]
                }
              }
            }
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" }
          }
        }
      },
      "/api/auth/google-login": {
        post: {
          tags: ["Authentication"],
          summary: "Login using Google",
          responses: {
            200: { description: "Google login successful" },
            400: { description: "Invalid Google credentials" }
          }
        }
      },
      "/api/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Get current logged-in user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Current user information" },
            401: { description: "Unauthorized" }
          }
        }
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
                    email: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Password reset OTP sent" }
          }
        }
      },
      "/api/auth/reset-password": {
        post: {
          tags: ["Authentication"],
          summary: "Reset password",
          responses: {
            200: { description: "Password reset successful" },
            400: { description: "Invalid reset information" }
          }
        }
      },
      "/api/auth/refresh-token": {
        post: {
          tags: ["Authentication"],
          summary: "Refresh access token",
          responses: {
            200: { description: "Token refreshed successfully" },
            401: { description: "Invalid refresh token" }
          }
        }
      },
      "/api/donation-requests": {
        post: {
          tags: ["Donation Requests"],
          summary: "Create a donation request",
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: "Donation request created" },
            401: { description: "Unauthorized" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Donation request details" },
            404: { description: "Donation request not found" }
          }
        }
      },
      "/api/admin/donation-requests/pending": {
        get: {
          tags: ["Admin"],
          summary: "Get pending donation requests",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Pending donation requests" },
            401: { description: "Unauthorized" },
            403: { description: "Admin access required" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Donation request verified" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Donation request rejected" }
          }
        }
      },
      "/api/donor/donation-requests": {
        get: {
          tags: ["Donor"],
          summary: "Get verified donation requests",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Verified donation requests" }
          }
        }
      },
      "/api/donations": {
        post: {
          tags: ["Donations"],
          summary: "Create a donation",
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: "Donation created successfully" }
          }
        }
      },
      "/api/donations/my-donations": {
        get: {
          tags: ["Donations"],
          summary: "Get my donations",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Donor donation history" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            201: { description: "Conversation created" }
          }
        }
      },
      "/api/communication/messages": {
        post: {
          tags: ["Communication"],
          summary: "Send a message",
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: "Message sent successfully" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Conversation messages" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "bKash payment created" }
          }
        }
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
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Payment executed successfully" }
          }
        }
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
              schema: { type: "string" }
            },
            {
              name: "status",
              in: "query",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: { description: "Payment callback received" }
          }
        }
      }
    }
  },
  apis: []
};
var swaggerSpec = swaggerJsdoc(options);

// src/app/middleware/globalErrorHandler.ts
import httpStatus from "http-status";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id   String @id @default(uuid())\n  name String\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("admins")\n}\n\nmodel Conversation {\n  id String @id @default(uuid())\n\n  requestId String\n  request   DonationRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)\n\n  donorId String\n  donor   User   @relation("DonorConversations", fields: [donorId], references: [id], onDelete: Cascade)\n\n  needyId String\n  needy   User   @relation("NeedyConversations", fields: [needyId], references: [id], onDelete: Cascade)\n\n  messages Message[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([requestId, donorId])\n  @@index([donorId])\n  @@index([needyId])\n  @@index([requestId])\n  @@map("conversations")\n}\n\nmodel Message {\n  id String @id @default(uuid())\n\n  conversationId String\n  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)\n\n  senderId String\n  sender   User   @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)\n\n  message String\n\n  createdAt DateTime @default(now())\n\n  @@index([conversationId])\n  @@index([senderId])\n  @@index([createdAt])\n  @@map("messages")\n}\n\nmodel Donation {\n  id     String         @id @default(uuid())\n  amount Decimal        @db.Decimal(12, 2)\n  status DonationStatus @default(PENDING)\n\n  paymentId     String?\n  paymentStatus String?\n\n  donorId String\n  donor   User   @relation("DonorDonations", fields: [donorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  requestId String\n  request   DonationRequest @relation(fields: [requestId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([donorId], name: "idx_donation_donorId")\n  @@index([requestId], name: "idx_donation_requestId")\n  @@index([status], name: "idx_donation_status")\n  @@map("donations")\n}\n\nmodel DonationRequest {\n  id             String  @id @default(uuid())\n  title          String\n  description    String\n  requiredAmount Decimal @db.Decimal(12, 2)\n\n  situationVideo String?\n  situationAudio String?\n\n  status DonationRequestStatus @default(PENDING)\n\n  rejectionReason String?\n  reviewedAt      DateTime?\n\n  needyId String\n  needy   User   @relation("NeedyRequests", fields: [needyId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  reviewedById String?\n  reviewedBy   User?   @relation("ReviewedRequests", fields: [reviewedById], references: [id], onDelete: SetNull, onUpdate: Cascade)\n\n  donations     Donation[]\n  conversations Conversation[]\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n\n  @@index([needyId], name: "idx_donation_request_needyId")\n  @@index([status], name: "idx_donation_request_status")\n  @@index([reviewedById], name: "idx_donation_request_reviewedById")\n  @@index([createdAt], name: "idx_donation_request_createdAt")\n  @@map("donation_requests")\n}\n\nmodel Donor {\n  id      String  @id @default(uuid())\n  name    String\n  phone   String?\n  address String?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([isDeleted], name: "idx_donor_isDeleted")\n  @@map("donors")\n}\n\nenum Role {\n  NEEDY\n  DONOR\n  ADMIN\n}\n\nenum AuthProvider {\n  CREDENTIAL\n  GOOGLE\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum DonationRequestStatus {\n  PENDING\n  VERIFIED\n  REJECTED\n  COMPLETED\n}\n\nenum DonationStatus {\n  PENDING\n  COMPLETED\n  CANCELLED\n}\n\nmodel Needy {\n  id          String  @id @default(uuid())\n  name        String\n  phone       String?\n  address     String?\n  description String?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([isDeleted], name: "idx_needy_isDeleted")\n  @@map("needies")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider               = "prisma-client"\n  output                 = "../../src/generated/prisma"\n  moduleFormat           = "esm"\n  generatedFileExtension = "ts"\n  importFileExtension    = "js"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String\n  email    String  @unique\n  password String?\n  imageUrl String?\n  phone    String?\n  address  String?\n  googleId String? @unique\n\n  role          Role         @default(NEEDY)\n  status        UserStatus   @default(ACTIVE)\n  authProvider  AuthProvider @default(CREDENTIAL)\n  emailVerified Boolean      @default(false)\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Profile relations\n  needy Needy?\n  donor Donor?\n  admin Admin?\n\n  // Donation request relations\n  needyRequests    DonationRequest[] @relation("NeedyRequests")\n  reviewedRequests DonationRequest[] @relation("ReviewedRequests")\n\n  // Donation relation\n  donations          Donation[]     @relation("DonorDonations")\n  donorConversations Conversation[] @relation("DonorConversations")\n  needyConversations Conversation[] @relation("NeedyConversations")\n  sentMessages       Message[]      @relation("SentMessages")\n\n  @@index([email], name: "idx_user_email")\n  @@index([role], name: "idx_user_role")\n  @@index([status], name: "idx_user_status")\n  @@index([isDeleted], name: "idx_user_isDeleted")\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admins","schema":null},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"request","kind":"object","type":"DonationRequest","relationName":"ConversationToDonationRequest"},{"name":"donorId","kind":"scalar","type":"String"},{"name":"donor","kind":"object","type":"User","relationName":"DonorConversations"},{"name":"needyId","kind":"scalar","type":"String"},{"name":"needy","kind":"object","type":"User","relationName":"NeedyConversations"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"conversations","schema":null},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"sender","kind":"object","type":"User","relationName":"SentMessages"},{"name":"message","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"messages","schema":null},"Donation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"DonationStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"paymentStatus","kind":"scalar","type":"String"},{"name":"donorId","kind":"scalar","type":"String"},{"name":"donor","kind":"object","type":"User","relationName":"DonorDonations"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"request","kind":"object","type":"DonationRequest","relationName":"DonationToDonationRequest"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"donations","schema":null},"DonationRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"requiredAmount","kind":"scalar","type":"Decimal"},{"name":"situationVideo","kind":"scalar","type":"String"},{"name":"situationAudio","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"DonationRequestStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"needyId","kind":"scalar","type":"String"},{"name":"needy","kind":"object","type":"User","relationName":"NeedyRequests"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"reviewedBy","kind":"object","type":"User","relationName":"ReviewedRequests"},{"name":"donations","kind":"object","type":"Donation","relationName":"DonationToDonationRequest"},{"name":"conversations","kind":"object","type":"Conversation","relationName":"ConversationToDonationRequest"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"donation_requests","schema":null},"Donor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"DonorToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"donors","schema":null},"Needy":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NeedyToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"needies","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"needy","kind":"object","type":"Needy","relationName":"NeedyToUser"},{"name":"donor","kind":"object","type":"Donor","relationName":"DonorToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"needyRequests","kind":"object","type":"DonationRequest","relationName":"NeedyRequests"},{"name":"reviewedRequests","kind":"object","type":"DonationRequest","relationName":"ReviewedRequests"},{"name":"donations","kind":"object","type":"Donation","relationName":"DonorDonations"},{"name":"donorConversations","kind":"object","type":"Conversation","relationName":"DonorConversations"},{"name":"needyConversations","kind":"object","type":"Conversation","relationName":"NeedyConversations"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"SentMessages"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","user","needy","donor","admin","orderBy","cursor","reviewedBy","request","donations","conversation","sender","messages","_count","conversations","needyRequests","reviewedRequests","donorConversations","needyConversations","sentMessages","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","Donation.findUnique","Donation.findUniqueOrThrow","Donation.findFirst","Donation.findFirstOrThrow","Donation.findMany","Donation.createOne","Donation.createMany","Donation.createManyAndReturn","Donation.updateOne","Donation.updateMany","Donation.updateManyAndReturn","Donation.upsertOne","Donation.deleteOne","Donation.deleteMany","_avg","_sum","Donation.groupBy","Donation.aggregate","DonationRequest.findUnique","DonationRequest.findUniqueOrThrow","DonationRequest.findFirst","DonationRequest.findFirstOrThrow","DonationRequest.findMany","DonationRequest.createOne","DonationRequest.createMany","DonationRequest.createManyAndReturn","DonationRequest.updateOne","DonationRequest.updateMany","DonationRequest.updateManyAndReturn","DonationRequest.upsertOne","DonationRequest.deleteOne","DonationRequest.deleteMany","DonationRequest.groupBy","DonationRequest.aggregate","Donor.findUnique","Donor.findUniqueOrThrow","Donor.findFirst","Donor.findFirstOrThrow","Donor.findMany","Donor.createOne","Donor.createMany","Donor.createManyAndReturn","Donor.updateOne","Donor.updateMany","Donor.updateManyAndReturn","Donor.upsertOne","Donor.deleteOne","Donor.deleteMany","Donor.groupBy","Donor.aggregate","Needy.findUnique","Needy.findUniqueOrThrow","Needy.findFirst","Needy.findFirstOrThrow","Needy.findMany","Needy.createOne","Needy.createMany","Needy.createManyAndReturn","Needy.updateOne","Needy.updateMany","Needy.updateManyAndReturn","Needy.upsertOne","Needy.deleteOne","Needy.deleteMany","Needy.groupBy","Needy.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","imageUrl","phone","address","googleId","Role","role","UserStatus","status","AuthProvider","authProvider","emailVerified","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","description","userId","title","requiredAmount","situationVideo","situationAudio","DonationRequestStatus","rejectionReason","reviewedAt","needyId","reviewedById","amount","DonationStatus","paymentId","paymentStatus","donorId","requestId","conversationId","senderId","message","requestId_donorId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "vQRIgAEJAQAAjgIAIJwBAACqAgAwnQEAAAcAEJ4BAACqAgAwnwEBAAAAAaABAQD9AQAhsAFAAIQCACGxAUAAhAIAIcEBAQAAAAEBAAAAAQAgDgEAAI4CACCcAQAAjQIAMJ0BAAADABCeAQAAjQIAMJ8BAQD9AQAhoAEBAP0BACGkAQEA_gEAIaUBAQD-AQAhrgEgAIICACGvAUAAgwIAIbABQACEAgAhsQFAAIQCACHAAQEA_gEAIcEBAQD9AQAhAQAAAAMAIA0BAACOAgAgnAEAAJACADCdAQAABQAQngEAAJACADCfAQEA_QEAIaABAQD9AQAhpAEBAP4BACGlAQEA_gEAIa4BIACCAgAhrwFAAIMCACGwAUAAhAIAIbEBQACEAgAhwQEBAP0BACEBAAAABQAgCQEAAI4CACCcAQAAqgIAMJ0BAAAHABCeAQAAqgIAMJ8BAQD9AQAhoAEBAP0BACGwAUAAhAIAIbEBQACEAgAhwQEBAP0BACEBAAAABwAgFAIAAI4CACAHAACpAgAgCQAAiQIAIA4AAIoCACCcAQAApwIAMJ0BAAAJABCeAQAApwIAMJ8BAQD9AQAhqgEAAKgCxwEisAFAAIQCACGxAUAAhAIAIcABAQD9AQAhwgEBAP0BACHDARAApQIAIcQBAQD-AQAhxQEBAP4BACHHAQEA_gEAIcgBQACDAgAhyQEBAP0BACHKAQEA_gEAIQkCAADcAwAgBwAA3AMAIAkAANQDACAOAADVAwAgxAEAAKsCACDFAQAAqwIAIMcBAACrAgAgyAEAAKsCACDKAQAAqwIAIBQCAACOAgAgBwAAqQIAIAkAAIkCACAOAACKAgAgnAEAAKcCADCdAQAACQAQngEAAKcCADCfAQEAAAABqgEAAKgCxwEisAFAAIQCACGxAUAAhAIAIcABAQD9AQAhwgEBAP0BACHDARAApQIAIcQBAQD-AQAhxQEBAP4BACHHAQEA_gEAIcgBQACDAgAhyQEBAP0BACHKAQEA_gEAIQMAAAAJACAFAAAKADAGAAALACAcAgAAhQIAIAMAAIYCACAEAACHAgAgCQAAiQIAIA8AAIgCACAQAACIAgAgEQAAigIAIBIAAIoCACATAACLAgAgnAEAAPwBADCdAQAADQAQngEAAPwBADCfAQEA_QEAIaABAQD9AQAhoQEBAP0BACGiAQEA_gEAIaMBAQD-AQAhpAEBAP4BACGlAQEA_gEAIaYBAQD-AQAhqAEAAP8BqAEiqgEAAIACqgEirAEAAIECrAEirQEgAIICACGuASAAggIAIa8BQACDAgAhsAFAAIQCACGxAUAAhAIAIQEAAAANACAOAwAAjgIAIAgAAKMCACCcAQAApAIAMJ0BAAAPABCeAQAApAIAMJ8BAQD9AQAhqgEAAKYCzQEisAFAAIQCACGxAUAAhAIAIcsBEAClAgAhzQEBAP4BACHOAQEA_gEAIc8BAQD9AQAh0AEBAP0BACEEAwAA3AMAIAgAAPgDACDNAQAAqwIAIM4BAACrAgAgDgMAAI4CACAIAACjAgAgnAEAAKQCADCdAQAADwAQngEAAKQCADCfAQEAAAABqgEAAKYCzQEisAFAAIQCACGxAUAAhAIAIcsBEAClAgAhzQEBAP4BACHOAQEA_gEAIc8BAQD9AQAh0AEBAP0BACEDAAAADwAgBQAAEAAwBgAAEQAgDQIAAI4CACADAACOAgAgCAAAowIAIAwAAIsCACCcAQAAogIAMJ0BAAATABCeAQAAogIAMJ8BAQD9AQAhsAFAAIQCACGxAUAAhAIAIckBAQD9AQAhzwEBAP0BACHQAQEA_QEAIQQCAADcAwAgAwAA3AMAIAgAAPgDACAMAADWAwAgDgIAAI4CACADAACOAgAgCAAAowIAIAwAAIsCACCcAQAAogIAMJ0BAAATABCeAQAAogIAMJ8BAQAAAAGwAUAAhAIAIbEBQACEAgAhyQEBAP0BACHPAQEA_QEAIdABAQD9AQAh1AEAAKECACADAAAAEwAgBQAAFAAwBgAAFQAgCgoAAKACACALAACOAgAgnAEAAJ8CADCdAQAAFwAQngEAAJ8CADCfAQEA_QEAIbABQACEAgAh0QEBAP0BACHSAQEA_QEAIdMBAQD9AQAhAgoAAPcDACALAADcAwAgCgoAAKACACALAACOAgAgnAEAAJ8CADCdAQAAFwAQngEAAJ8CADCfAQEAAAABsAFAAIQCACHRAQEA_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_gEAIa4BIACCAgAhrwFAAIMCACGwAUAAhAIAIbEBQACEAgAhwQEBAAAAAQEAAACZAQAgAQAAAJkBACAEAQAA3AMAIKQBAACrAgAgpQEAAKsCACCvAQAAqwIAIAMAAAAFACAFAACcAQAwBgAAmQEAIAMAAAAFACAFAACcAQAwBgAAmQEAIAMAAAAFACAFAACcAQAwBgAAmQEAIAoBAADhAwAgnwEBAAAAAaABAQAAAAGkAQEAAAABpQEBAAAAAa4BIAAAAAGvAUAAAAABsAFAAAAAAbEBQAAAAAHBAQEAAAABARkAAKABACAJnwEBAAAAAaABAQAAAAGkAQEAAAABpQEBAAAAAa4BIAAAAAGvAUAAAAABsAFAAAAAAbEBQAAAAAHBAQEAAAABARkAAKIBADABGQAAogEAMAoBAADgAwAgnwEBAK8CACGgAQEArwIAIaQBAQCwAgAhpQEBALACACGuASAAtAIAIa8BQAC1AgAhsAFAALYCACGxAUAAtgIAIcEBAQCvAgAhAgAAAJkBACAZAAClAQAgCZ8BAQCvAgAhoAEBAK8CACGkAQEAsAIAIaUBAQCwAgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACHBAQEArwIAIQIAAAAFACAZAACnAQAgAgAAAAUAIBkAAKcBACADAAAAmQEAICAAAKABACAhAAClAQAgAQAAAJkBACABAAAABQAgBg0AAN0DACAmAADfAwAgJwAA3gMAIKQBAACrAgAgpQEAAKsCACCvAQAAqwIAIAycAQAAjwIAMJ0BAACuAQAQngEAAI8CADCfAQEA4gEAIaABAQDiAQAhpAEBAOMBACGlAQEA4wEAIa4BIADnAQAhrwFAAOgBACGwAUAA6QEAIbEBQADpAQAhwQEBAOIBACEDAAAABQAgBQAArQEAMCUAAK4BACADAAAABQAgBQAAnAEAMAYAAJkBACAOAQAAjgIAIJwBAACNAgAwnQEAAAMAEJ4BAACNAgAwnwEBAAAAAaABAQD9AQAhpAEBAP4BACGlAQEA_gEAIa4BIACCAgAhrwFAAIMCACGwAUAAhAIAIbEBQACEAgAhwAEBAP4BACHBAQEAAAABAQAAALEBACABAAAAsQEAIAUBAADcAwAgpAEAAKsCACClAQAAqwIAIK8BAACrAgAgwAEAAKsCACADAAAAAwAgBQAAtAEAMAYAALEBACADAAAAAwAgBQAAtAEAMAYAALEBACADAAAAAwAgBQAAtAEAMAYAALEBACALAQAA2wMAIJ8BAQAAAAGgAQEAAAABpAEBAAAAAaUBAQAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABwAEBAAAAAcEBAQAAAAEBGQAAuAEAIAqfAQEAAAABoAEBAAAAAaQBAQAAAAGlAQEAAAABrgEgAAAAAa8BQAAAAAGwAUAAAAABsQFAAAAAAcABAQAAAAHBAQEAAAABARkAALoBADABGQAAugEAMAsBAADaAwAgnwEBAK8CACGgAQEArwIAIaQBAQCwAgAhpQEBALACACGuASAAtAIAIa8BQAC1AgAhsAFAALYCACGxAUAAtgIAIcABAQCwAgAhwQEBAK8CACECAAAAsQEAIBkAAL0BACAKnwEBAK8CACGgAQEArwIAIaQBAQCwAgAhpQEBALACACGuASAAtAIAIa8BQAC1AgAhsAFAALYCACGxAUAAtgIAIcABAQCwAgAhwQEBAK8CACECAAAAAwAgGQAAvwEAIAIAAAADACAZAAC_AQAgAwAAALEBACAgAAC4AQAgIQAAvQEAIAEAAACxAQAgAQAAAAMAIAcNAADXAwAgJgAA2QMAICcAANgDACCkAQAAqwIAIKUBAACrAgAgrwEAAKsCACDAAQAAqwIAIA2cAQAAjAIAMJ0BAADGAQAQngEAAIwCADCfAQEA4gEAIaABAQDiAQAhpAEBAOMBACGlAQEA4wEAIa4BIADnAQAhrwFAAOgBACGwAUAA6QEAIbEBQADpAQAhwAEBAOMBACHBAQEA4gEAIQMAAAADACAFAADFAQAwJQAAxgEAIAMAAAADACAFAAC0AQAwBgAAsQEAIBwCAACFAgAgAwAAhgIAIAQAAIcCACAJAACJAgAgDwAAiAIAIBAAAIgCACARAACKAgAgEgAAigIAIBMAAIsCACCcAQAA_AEAMJ0BAAANABCeAQAA_AEAMJ8BAQAAAAGgAQEA_QEAIaEBAQAAAAGiAQEA_gEAIaMBAQD-AQAhpAEBAP4BACGlAQEA_gEAIaYBAQAAAAGoAQAA_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_QEAIaABAQD9AQAhoQEBAP0BACGiAQEA_gEAIaMBAQD-AQAhpAEBAP4BACGlAQEA_gEAIaYBAQD-AQAhqAEAAP8BqAEiqgEAAIACqgEirAEAAIECrAEirQEgAIICACGuASAAggIAIa8BQACDAgAhsAFAAIQCACGxAUAAhAIAIQuyAQEAAAABswEBAAAABLQBAQAAAAS1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAPsBACG6AQEAAAABuwEBAAAAAbwBAQAAAAELsgEBAAAAAbMBAQAAAAW0AQEAAAAFtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQD5AQAhugEBAAAAAbsBAQAAAAG8AQEAAAABBLIBAAAAqAECswEAAACoAQi0AQAAAKgBCLkBAAD3AagBIgSyAQAAAKoBArMBAAAAqgEItAEAAACqAQi5AQAA9QGqASIEsgEAAACsAQKzAQAAAKwBCLQBAAAArAEIuQEAAPMBrAEiArIBIAAAAAG5ASAA8QEAIQiyAUAAAAABswFAAAAABbQBQAAAAAW1AUAAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABuQFAAO8BACEIsgFAAAAAAbMBQAAAAAS0AUAAAAAEtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAbkBQADsAQAhEAEAAI4CACCcAQAAjQIAMJ0BAAADABCeAQAAjQIAMJ8BAQD9AQAhoAEBAP0BACGkAQEA_gEAIaUBAQD-AQAhrgEgAIICACGvAUAAgwIAIbABQACEAgAhsQFAAIQCACHAAQEA_gEAIcEBAQD9AQAh1QEAAAMAINYBAAADACAPAQAAjgIAIJwBAACQAgAwnQEAAAUAEJ4BAACQAgAwnwEBAP0BACGgAQEA_QEAIaQBAQD-AQAhpQEBAP4BACGuASAAggIAIa8BQACDAgAhsAFAAIQCACGxAUAAhAIAIcEBAQD9AQAh1QEAAAUAINYBAAAFACALAQAAjgIAIJwBAACqAgAwnQEAAAcAEJ4BAACqAgAwnwEBAP0BACGgAQEA_QEAIbABQACEAgAhsQFAAIQCACHBAQEA_QEAIdUBAAAHACDWAQAABwAgA70BAAAJACC-AQAACQAgvwEAAAkAIAO9AQAADwAgvgEAAA8AIL8BAAAPACADvQEAABMAIL4BAAATACC_AQAAEwAgA70BAAAXACC-AQAAFwAgvwEAABcAIA2cAQAAjAIAMJ0BAADGAQAQngEAAIwCADCfAQEA4gEAIaABAQDiAQAhpAEBAOMBACGlAQEA4wEAIa4BIADnAQAhrwFAAOgBACGwAUAA6QEAIbEBQADpAQAhwAEBAOMBACHBAQEA4gEAIQ4BAACOAgAgnAEAAI0CADCdAQAAAwAQngEAAI0CADCfAQEA_QEAIaABAQD9AQAhpAEBAP4BACGlAQEA_gEAIa4BIACCAgAhrwFAAIMCACGwAUAAhAIAIbEBQACEAgAhwAEBAP4BACHBAQEA_QEAIR4CAACFAgAgAwAAhgIAIAQAAIcCACAJAACJAgAgDwAAiAIAIBAAAIgCACARAACKAgAgEgAAigIAIBMAAIsCACCcAQAA_AEAMJ0BAAANABCeAQAA_AEAMJ8BAQD9AQAhoAEBAP0BACGhAQEA_QEAIaIBAQD-AQAhowEBAP4BACGkAQEA_gEAIaUBAQD-AQAhpgEBAP4BACGoAQAA_wGoASKqAQAAgAKqASKsAQAAgQKsASKtASAAggIAIa4BIACCAgAhrwFAAIMCACGwAUAAhAIAIbEBQACEAgAh1QEAAA0AINYBAAANACAMnAEAAI8CADCdAQAArgEAEJ4BAACPAgAwnwEBAOIBACGgAQEA4gEAIaQBAQDjAQAhpQEBAOMBACGuASAA5wEAIa8BQADoAQAhsAFAAOkBACGxAUAA6QEAIcEBAQDiAQAhDQEAAI4CACCcAQAAkAIAMJ0BAAAFABCeAQAAkAIAMJ8BAQD9AQAhoAEBAP0BACGkAQEA_gEAIaUBAQD-AQAhrgEgAIICACGvAUAAgwIAIbABQACEAgAhsQFAAIQCACHBAQEA_QEAIRCcAQAAkQIAMJ0BAACWAQAQngEAAJECADCfAQEA4gEAIaoBAACTAscBIrABQADpAQAhsQFAAOkBACHAAQEA4gEAIcIBAQDiAQAhwwEQAJICACHEAQEA4wEAIcUBAQDjAQAhxwEBAOMBACHIAUAA6AEAIckBAQDiAQAhygEBAOMBACENDQAA6wEAICYAAJcCACAnAACXAgAgWAAAlwIAIFkAAJcCACCyARAAAAABswEQAAAABLQBEAAAAAS1ARAAAAABtgEQAAAAAbcBEAAAAAG4ARAAAAABuQEQAJYCACEHDQAA6wEAICYAAJUCACAnAACVAgAgsgEAAADHAQKzAQAAAMcBCLQBAAAAxwEIuQEAAJQCxwEiBw0AAOsBACAmAACVAgAgJwAAlQIAILIBAAAAxwECswEAAADHAQi0AQAAAMcBCLkBAACUAscBIgSyAQAAAMcBArMBAAAAxwEItAEAAADHAQi5AQAAlQLHASINDQAA6wEAICYAAJcCACAnAACXAgAgWAAAlwIAIFkAAJcCACCyARAAAAABswEQAAAABLQBEAAAAAS1ARAAAAABtgEQAAAAAbcBEAAAAAG4ARAAAAABuQEQAJYCACEIsgEQAAAAAbMBEAAAAAS0ARAAAAAEtQEQAAAAAbYBEAAAAAG3ARAAAAABuAEQAAAAAbkBEACXAgAhDJwBAACYAgAwnQEAAH4AEJ4BAACYAgAwnwEBAOIBACGqAQAAmQLNASKwAUAA6QEAIbEBQADpAQAhywEQAJICACHNAQEA4wEAIc4BAQDjAQAhzwEBAOIBACHQAQEA4gEAIQcNAADrAQAgJgAAmwIAICcAAJsCACCyAQAAAM0BArMBAAAAzQEItAEAAADNAQi5AQAAmgLNASIHDQAA6wEAICYAAJsCACAnAACbAgAgsgEAAADNAQKzAQAAAM0BCLQBAAAAzQEIuQEAAJoCzQEiBLIBAAAAzQECswEAAADNAQi0AQAAAM0BCLkBAACbAs0BIgicAQAAnAIAMJ0BAABoABCeAQAAnAIAMJ8BAQDiAQAhsAFAAOkBACHRAQEA4gEAIdIBAQDiAQAh0wEBAOIBACEJnAEAAJ0CADCdAQAAUgAQngEAAJ0CADCfAQEA4gEAIbABQADpAQAhsQFAAOkBACHJAQEA4gEAIc8BAQDiAQAh0AEBAOIBACEInAEAAJ4CADCdAQAAPAAQngEAAJ4CADCfAQEA4gEAIaABAQDiAQAhsAFAAOkBACGxAUAA6QEAIcEBAQDiAQAhCgoAAKACACALAACOAgAgnAEAAJ8CADCdAQAAFwAQngEAAJ8CADCfAQEA_QEAIbABQACEAgAh0QEBAP0BACHSAQEA_QEAIdMBAQD9AQAhDwIAAI4CACADAACOAgAgCAAAowIAIAwAAIsCACCcAQAAogIAMJ0BAAATABCeAQAAogIAMJ8BAQD9AQAhsAFAAIQCACGxAUAAhAIAIckBAQD9AQAhzwEBAP0BACHQAQEA_QEAIdUBAAATACDWAQAAEwAgAs8BAQAAAAHQAQEAAAABDQIAAI4CACADAACOAgAgCAAAowIAIAwAAIsCACCcAQAAogIAMJ0BAAATABCeAQAAogIAMJ8BAQD9AQAhsAFAAIQCACGxAUAAhAIAIckBAQD9AQAhzwEBAP0BACHQAQEA_QEAIRYCAACOAgAgBwAAqQIAIAkAAIkCACAOAACKAgAgnAEAAKcCADCdAQAACQAQngEAAKcCADCfAQEA_QEAIaoBAACoAscBIrABQACEAgAhsQFAAIQCACHAAQEA_QEAIcIBAQD9AQAhwwEQAKUCACHEAQEA_gEAIcUBAQD-AQAhxwEBAP4BACHIAUAAgwIAIckBAQD9AQAhygEBAP4BACHVAQAACQAg1gEAAAkAIA4DAACOAgAgCAAAowIAIJwBAACkAgAwnQEAAA8AEJ4BAACkAgAwnwEBAP0BACGqAQAApgLNASKwAUAAhAIAIbEBQACEAgAhywEQAKUCACHNAQEA_gEAIc4BAQD-AQAhzwEBAP0BACHQAQEA_QEAIQiyARAAAAABswEQAAAABLQBEAAAAAS1ARAAAAABtgEQAAAAAbcBEAAAAAG4ARAAAAABuQEQAJcCACEEsgEAAADNAQKzAQAAAM0BCLQBAAAAzQEIuQEAAJsCzQEiFAIAAI4CACAHAACpAgAgCQAAiQIAIA4AAIoCACCcAQAApwIAMJ0BAAAJABCeAQAApwIAMJ8BAQD9AQAhqgEAAKgCxwEisAFAAIQCACGxAUAAhAIAIcABAQD9AQAhwgEBAP0BACHDARAApQIAIcQBAQD-AQAhxQEBAP4BACHHAQEA_gEAIcgBQACDAgAhyQEBAP0BACHKAQEA_gEAIQSyAQAAAMcBArMBAAAAxwEItAEAAADHAQi5AQAAlQLHASIeAgAAhQIAIAMAAIYCACAEAACHAgAgCQAAiQIAIA8AAIgCACAQAACIAgAgEQAAigIAIBIAAIoCACATAACLAgAgnAEAAPwBADCdAQAADQAQngEAAPwBADCfAQEA_QEAIaABAQD9AQAhoQEBAP0BACGiAQEA_gEAIaMBAQD-AQAhpAEBAP4BACGlAQEA_gEAIaYBAQD-AQAhqAEAAP8BqAEiqgEAAIACqgEirAEAAIECrAEirQEgAIICACGuASAAggIAIa8BQACDAgAhsAFAAIQCACGxAUAAhAIAIdUBAAANACDWAQAADQAgCQEAAI4CACCcAQAAqgIAMJ0BAAAHABCeAQAAqgIAMJ8BAQD9AQAhoAEBAP0BACGwAUAAhAIAIbEBQACEAgAhwQEBAP0BACEAAAAAAdoBAQAAAAEB2gEBAAAAAQHaAQAAAKgBAgHaAQAAAKoBAgHaAQAAAKwBAgHaASAAAAABAdoBQAAAAAEB2gFAAAAAAQcgAADCAwAgIQAAxQMAINcBAADDAwAg2AEAAMQDACDbAQAAAwAg3AEAAAMAIN0BAACxAQAgByAAAL0DACAhAADAAwAg1wEAAL4DACDYAQAAvwMAINsBAAAFACDcAQAABQAg3QEAAJkBACAHIAAAuAMAICEAALsDACDXAQAAuQMAINgBAAC6AwAg2wEAAAcAINwBAAAHACDdAQAAAQAgCyAAAK0DADAhAACxAwAw1wEAAK4DADDYAQAArwMAMNkBAACwAwAg2gEAAIoDADDbAQAAigMAMNwBAACKAwAw3QEAAIoDADDeAQAAsgMAMN8BAACNAwAwCyAAAIYDADAhAACLAwAw1wEAAIcDADDYAQAAiAMAMNkBAACJAwAg2gEAAIoDADDbAQAAigMAMNwBAACKAwAw3QEAAIoDADDeAQAAjAMAMN8BAACNAwAwCyAAAPYCADAhAAD7AgAw1wEAAPcCADDYAQAA-AIAMNkBAAD5AgAg2gEAAPoCADDbAQAA-gIAMNwBAAD6AgAw3QEAAPoCADDeAQAA_AIAMN8BAAD9AgAwCyAAAOsCADAhAADvAgAw1wEAAOwCADDYAQAA7QIAMNkBAADuAgAg2gEAANICADDbAQAA0gIAMNwBAADSAgAw3QEAANICADDeAQAA8AIAMN8BAADVAgAwCyAAAM4CADAhAADTAgAw1wEAAM8CADDYAQAA0AIAMNkBAADRAgAg2gEAANICADDbAQAA0gIAMNwBAADSAgAw3QEAANICADDeAQAA1AIAMN8BAADVAgAwCyAAAMACADAhAADFAgAw1wEAAMECADDYAQAAwgIAMNkBAADDAgAg2gEAAMQCADDbAQAAxAIAMNwBAADEAgAw3QEAAMQCADDeAQAAxgIAMN8BAADHAgAwBQoAAM0CACCfAQEAAAABsAFAAAAAAdEBAQAAAAHTAQEAAAABAgAAABkAICAAAMwCACADAAAAGQAgIAAAzAIAICEAAMoCACABGQAAvQQAMAoKAACgAgAgCwAAjgIAIJwBAACfAgAwnQEAABcAEJ4BAACfAgAwnwEBAAAAAbABQACEAgAh0QEBAP0BACHSAQEA_QEAIdMBAQD9AQAhAgAAABkAIBkAAMoCACACAAAAyAIAIBkAAMkCACAInAEAAMcCADCdAQAAyAIAEJ4BAADHAgAwnwEBAP0BACGwAUAAhAIAIdEBAQD9AQAh0gEBAP0BACHTAQEA_QEAIQicAQAAxwIAMJ0BAADIAgAQngEAAMcCADCfAQEA_QEAIbABQACEAgAh0QEBAP0BACHSAQEA_QEAIdMBAQD9AQAhBJ8BAQCvAgAhsAFAALYCACHRAQEArwIAIdMBAQCvAgAhBQoAAMsCACCfAQEArwIAIbABQAC2AgAh0QEBAK8CACHTAQEArwIAIQUgAAC4BAAgIQAAuwQAINcBAAC5BAAg2AEAALoEACDdAQAAFQAgBQoAAM0CACCfAQEAAAABsAFAAAAAAdEBAQAAAAHTAQEAAAABAyAAALgEACDXAQAAuQQAIN0BAAAVACAIAwAA6QIAIAgAAOgCACAMAADqAgAgnwEBAAAAAbABQAAAAAGxAUAAAAABzwEBAAAAAdABAQAAAAECAAAAFQAgIAAA5wIAIAMAAAAVACAgAADnAgAgIQAA2AIAIAEZAAC3BAAwDgIAAI4CACADAACOAgAgCAAAowIAIAwAAIsCACCcAQAAogIAMJ0BAAATABCeAQAAogIAMJ8BAQAAAAGwAUAAhAIAIbEBQACEAgAhyQEBAP0BACHPAQEA_QEAIdABAQD9AQAh1AEAAKECACACAAAAFQAgGQAA2AIAIAIAAADWAgAgGQAA1wIAIAmcAQAA1QIAMJ0BAADWAgAQngEAANUCADCfAQEA_QEAIbABQACEAgAhsQFAAIQCACHJAQEA_QEAIc8BAQD9AQAh0AEBAP0BACEJnAEAANUCADCdAQAA1gIAEJ4BAADVAgAwnwEBAP0BACGwAUAAhAIAIbEBQACEAgAhyQEBAP0BACHPAQEA_QEAIdABAQD9AQAhBZ8BAQCvAgAhsAFAALYCACGxAUAAtgIAIc8BAQCvAgAh0AEBAK8CACEIAwAA2gIAIAgAANkCACAMAADbAgAgnwEBAK8CACGwAUAAtgIAIbEBQAC2AgAhzwEBAK8CACHQAQEArwIAIQUgAACpBAAgIQAAtQQAINcBAACqBAAg2AEAALQEACDdAQAACwAgBSAAAKcEACAhAACyBAAg1wEAAKgEACDYAQAAsQQAIN0BAADJAQAgCyAAANwCADAhAADgAgAw1wEAAN0CADDYAQAA3gIAMNkBAADfAgAg2gEAAMQCADDbAQAAxAIAMNwBAADEAgAw3QEAAMQCADDeAQAA4QIAMN8BAADHAgAwBQsAAOYCACCfAQEAAAABsAFAAAAAAdIBAQAAAAHTAQEAAAABAgAAABkAICAAAOUCACADAAAAGQAgIAAA5QIAICEAAOMCACABGQAAsAQAMAIAAAAZACAZAADjAgAgAgAAAMgCACAZAADiAgAgBJ8BAQCvAgAhsAFAALYCACHSAQEArwIAIdMBAQCvAgAhBQsAAOQCACCfAQEArwIAIbABQAC2AgAh0gEBAK8CACHTAQEArwIAIQUgAACrBAAgIQAArgQAINcBAACsBAAg2AEAAK0EACDdAQAAyQEAIAULAADmAgAgnwEBAAAAAbABQAAAAAHSAQEAAAAB0wEBAAAAAQMgAACrBAAg1wEAAKwEACDdAQAAyQEAIAgDAADpAgAgCAAA6AIAIAwAAOoCACCfAQEAAAABsAFAAAAAAbEBQAAAAAHPAQEAAAAB0AEBAAAAAQMgAACpBAAg1wEAAKoEACDdAQAACwAgAyAAAKcEACDXAQAAqAQAIN0BAADJAQAgBCAAANwCADDXAQAA3QIAMNkBAADfAgAg3QEAAMQCADAIAgAA9QIAIAgAAOgCACAMAADqAgAgnwEBAAAAAbABQAAAAAGxAUAAAAAByQEBAAAAAdABAQAAAAECAAAAFQAgIAAA9AIAIAMAAAAVACAgAAD0AgAgIQAA8gIAIAEZAACmBAAwAgAAABUAIBkAAPICACACAAAA1gIAIBkAAPECACAFnwEBAK8CACGwAUAAtgIAIbEBQAC2AgAhyQEBAK8CACHQAQEArwIAIQgCAADzAgAgCAAA2QIAIAwAANsCACCfAQEArwIAIbABQAC2AgAhsQFAALYCACHJAQEArwIAIdABAQCvAgAhBSAAAKEEACAhAACkBAAg1wEAAKIEACDYAQAAowQAIN0BAADJAQAgCAIAAPUCACAIAADoAgAgDAAA6gIAIJ8BAQAAAAGwAUAAAAABsQFAAAAAAckBAQAAAAHQAQEAAAABAyAAAKEEACDXAQAAogQAIN0BAADJAQAgCQgAAIUDACCfAQEAAAABqgEAAADNAQKwAUAAAAABsQFAAAAAAcsBEAAAAAHNAQEAAAABzgEBAAAAAdABAQAAAAECAAAAEQAgIAAAhAMAIAMAAAARACAgAACEAwAgIQAAggMAIAEZAACgBAAwDgMAAI4CACAIAACjAgAgnAEAAKQCADCdAQAADwAQngEAAKQCADCfAQEAAAABqgEAAKYCzQEisAFAAIQCACGxAUAAhAIAIcsBEAClAgAhzQEBAP4BACHOAQEA_gEAIc8BAQD9AQAh0AEBAP0BACECAAAAEQAgGQAAggMAIAIAAAD-AgAgGQAA_wIAIAycAQAA_QIAMJ0BAAD-AgAQngEAAP0CADCfAQEA_QEAIaoBAACmAs0BIrABQACEAgAhsQFAAIQCACHLARAApQIAIc0BAQD-AQAhzgEBAP4BACHPAQEA_QEAIdABAQD9AQAhDJwBAAD9AgAwnQEAAP4CABCeAQAA_QIAMJ8BAQD9AQAhqgEAAKYCzQEisAFAAIQCACGxAUAAhAIAIcsBEAClAgAhzQEBAP4BACHOAQEA_gEAIc8BAQD9AQAh0AEBAP0BACEInwEBAK8CACGqAQAAgQPNASKwAUAAtgIAIbEBQAC2AgAhywEQAIADACHNAQEAsAIAIc4BAQCwAgAh0AEBAK8CACEF2gEQAAAAAeABEAAAAAHhARAAAAAB4gEQAAAAAeMBEAAAAAEB2gEAAADNAQIJCAAAgwMAIJ8BAQCvAgAhqgEAAIEDzQEisAFAALYCACGxAUAAtgIAIcsBEACAAwAhzQEBALACACHOAQEAsAIAIdABAQCvAgAhBSAAAJsEACAhAACeBAAg1wEAAJwEACDYAQAAnQQAIN0BAAALACAJCAAAhQMAIJ8BAQAAAAGqAQAAAM0BArABQAAAAAGxAUAAAAABywEQAAAAAc0BAQAAAAHOAQEAAAAB0AEBAAAAAQMgAACbBAAg1wEAAJwEACDdAQAACwAgDwIAAKoDACAJAACrAwAgDgAArAMAIJ8BAQAAAAGqAQAAAMcBArABQAAAAAGxAUAAAAABwAEBAAAAAcIBAQAAAAHDARAAAAABxAEBAAAAAcUBAQAAAAHHAQEAAAAByAFAAAAAAckBAQAAAAECAAAACwAgIAAAqQMAIAMAAAALACAgAACpAwAgIQAAkQMAIAEZAACaBAAwFAIAAI4CACAHAACpAgAgCQAAiQIAIA4AAIoCACCcAQAApwIAMJ0BAAAJABCeAQAApwIAMJ8BAQAAAAGqAQAAqALHASKwAUAAhAIAIbEBQACEAgAhwAEBAP0BACHCAQEA_QEAIcMBEAClAgAhxAEBAP4BACHFAQEA_gEAIccBAQD-AQAhyAFAAIMCACHJAQEA_QEAIcoBAQD-AQAhAgAAAAsAIBkAAJEDACACAAAAjgMAIBkAAI8DACAQnAEAAI0DADCdAQAAjgMAEJ4BAACNAwAwnwEBAP0BACGqAQAAqALHASKwAUAAhAIAIbEBQACEAgAhwAEBAP0BACHCAQEA_QEAIcMBEAClAgAhxAEBAP4BACHFAQEA_gEAIccBAQD-AQAhyAFAAIMCACHJAQEA_QEAIcoBAQD-AQAhEJwBAACNAwAwnQEAAI4DABCeAQAAjQMAMJ8BAQD9AQAhqgEAAKgCxwEisAFAAIQCACGxAUAAhAIAIcABAQD9AQAhwgEBAP0BACHDARAApQIAIcQBAQD-AQAhxQEBAP4BACHHAQEA_gEAIcgBQACDAgAhyQEBAP0BACHKAQEA_gEAIQyfAQEArwIAIaoBAACQA8cBIrABQAC2AgAhsQFAALYCACHAAQEArwIAIcIBAQCvAgAhwwEQAIADACHEAQEAsAIAIcUBAQCwAgAhxwEBALACACHIAUAAtQIAIckBAQCvAgAhAdoBAAAAxwECDwIAAJIDACAJAACTAwAgDgAAlAMAIJ8BAQCvAgAhqgEAAJADxwEisAFAALYCACGxAUAAtgIAIcABAQCvAgAhwgEBAK8CACHDARAAgAMAIcQBAQCwAgAhxQEBALACACHHAQEAsAIAIcgBQAC1AgAhyQEBAK8CACEFIAAAjgQAICEAAJgEACDXAQAAjwQAINgBAACXBAAg3QEAAMkBACALIAAAngMAMCEAAKIDADDXAQAAnwMAMNgBAACgAwAw2QEAAKEDACDaAQAA-gIAMNsBAAD6AgAw3AEAAPoCADDdAQAA-gIAMN4BAACjAwAw3wEAAP0CADALIAAAlQMAMCEAAJkDADDXAQAAlgMAMNgBAACXAwAw2QEAAJgDACDaAQAA0gIAMNsBAADSAgAw3AEAANICADDdAQAA0gIAMN4BAACaAwAw3wEAANUCADAIAgAA9QIAIAMAAOkCACAMAADqAgAgnwEBAAAAAbABQAAAAAGxAUAAAAAByQEBAAAAAc8BAQAAAAECAAAAFQAgIAAAnQMAIAMAAAAVACAgAACdAwAgIQAAnAMAIAEZAACWBAAwAgAAABUAIBkAAJwDACACAAAA1gIAIBkAAJsDACAFnwEBAK8CACGwAUAAtgIAIbEBQAC2AgAhyQEBAK8CACHPAQEArwIAIQgCAADzAgAgAwAA2gIAIAwAANsCACCfAQEArwIAIbABQAC2AgAhsQFAALYCACHJAQEArwIAIc8BAQCvAgAhCAIAAPUCACADAADpAgAgDAAA6gIAIJ8BAQAAAAGwAUAAAAABsQFAAAAAAckBAQAAAAHPAQEAAAABCQMAAKgDACCfAQEAAAABqgEAAADNAQKwAUAAAAABsQFAAAAAAcsBEAAAAAHNAQEAAAABzgEBAAAAAc8BAQAAAAECAAAAEQAgIAAApwMAIAMAAAARACAgAACnAwAgIQAApQMAIAEZAACVBAAwAgAAABEAIBkAAKUDACACAAAA_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_gMAICEAAIEEACDXAQAA_wMAINgBAACABAAg3QEAAMkBACADIAAA_gMAINcBAAD_AwAg3QEAAMkBACAAAAAAAAAAAAAAAAAAAAAAAAAABSAAAPkDACAhAAD8AwAg1wEAAPoDACDYAQAA-wMAIN0BAADJAQAgAyAAAPkDACDXAQAA-gMAIN0BAADJAQAgBAIAANwDACADAADcAwAgCAAA-AMAIAwAANYDACAJAgAA3AMAIAcAANwDACAJAADUAwAgDgAA1QMAIMQBAACrAgAgxQEAAKsCACDHAQAAqwIAIMgBAACrAgAgygEAAKsCACAYAgAAxwMAIAMAAMgDACAJAADMAwAgDwAAygMAIBAAAMsDACARAADNAwAgEgAAzgMAIBMAAM8DACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEAAACqAQKsAQAAAKwBAq0BIAAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABAgAAAMkBACAgAAD5AwAgAwAAAA0AICAAAPkDACAhAAD9AwAgGgAAAA0AIAIAALcCACADAAC4AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAA_QMAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACADAAC4AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEYAgAAxwMAIAQAAMkDACAJAADMAwAgDwAAygMAIBAAAMsDACARAADNAwAgEgAAzgMAIBMAAM8DACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEAAACqAQKsAQAAAKwBAq0BIAAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABAgAAAMkBACAgAAD-AwAgAwAAAA0AICAAAP4DACAhAACCBAAgGgAAAA0AIAIAALcCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAAggQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEYAwAAyAMAIAQAAMkDACAJAADMAwAgDwAAygMAIBAAAMsDACARAADNAwAgEgAAzgMAIBMAAM8DACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEAAACqAQKsAQAAAKwBAq0BIAAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABAgAAAMkBACAgAACDBAAgAwAAAA0AICAAAIMEACAhAACHBAAgGgAAAA0AIAMAALgCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAAhwQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAMAALgCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEYAgAAxwMAIAMAAMgDACAEAADJAwAgCQAAzAMAIA8AAMoDACARAADNAwAgEgAAzgMAIBMAAM8DACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEAAACqAQKsAQAAAKwBAq0BIAAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABAgAAAMkBACAgAACIBAAgAwAAAA0AICAAAIgEACAhAACMBAAgGgAAAA0AIAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAPAAC6AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAAjAQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAPAAC6AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEMnwEBAAAAAaoBAAAAxwECsAFAAAAAAbEBQAAAAAHAAQEAAAABwgEBAAAAAcMBEAAAAAHEAQEAAAABxQEBAAAAAccBAQAAAAHIAUAAAAABygEBAAAAARgCAADHAwAgAwAAyAMAIAQAAMkDACAJAADMAwAgEAAAywMAIBEAAM0DACASAADOAwAgEwAAzwMAIJ8BAQAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpAEBAAAAAaUBAQAAAAGmAQEAAAABqAEAAACoAQKqAQAAAKoBAqwBAAAArAECrQEgAAAAAa4BIAAAAAGvAUAAAAABsAFAAAAAAbEBQAAAAAECAAAAyQEAICAAAI4EACAYAgAAxwMAIAMAAMgDACAEAADJAwAgDwAAygMAIBAAAMsDACARAADNAwAgEgAAzgMAIBMAAM8DACCfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEAAACqAQKsAQAAAKwBAq0BIAAAAAGuASAAAAABrwFAAAAAAbABQAAAAAGxAUAAAAABAgAAAMkBACAgAACQBAAgAwAAAA0AICAAAJAEACAhAACUBAAgGgAAAA0AIAIAALcCACADAAC4AgAgBAAAuQIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAAlAQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACADAAC4AgAgBAAAuQIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEInwEBAAAAAaoBAAAAzQECsAFAAAAAAbEBQAAAAAHLARAAAAABzQEBAAAAAc4BAQAAAAHPAQEAAAABBZ8BAQAAAAGwAUAAAAABsQFAAAAAAckBAQAAAAHPAQEAAAABAwAAAA0AICAAAI4EACAhAACZBAAgGgAAAA0AIAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_AgAgGQAAmQQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAQAAC7AgAgEQAAvQIAIBIAAL4CACATAAC_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sAFAAAAAAbEBQAAAAAECAAAAyQEAICAAAKsEACADAAAADQAgIAAAqwQAICEAAK8EACAaAAAADQAgAgAAtwIAIAMAALgCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACAZAACvBAAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEYAgAAtwIAIAMAALgCACAEAAC5AgAgCQAAvAIAIA8AALoCACAQAAC7AgAgEQAAvQIAIBIAAL4CACCfAQEArwIAIaABAQCvAgAhoQEBAK8CACGiAQEAsAIAIaMBAQCwAgAhpAEBALACACGlAQEAsAIAIaYBAQCwAgAhqAEAALECqAEiqgEAALICqgEirAEAALMCrAEirQEgALQCACGuASAAtAIAIa8BQAC1AgAhsAFAALYCACGxAUAAtgIAIQSfAQEAAAABsAFAAAAAAdIBAQAAAAHTAQEAAAABAwAAAA0AICAAAKcEACAhAACzBAAgGgAAAA0AIAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAPAAC6AgAgEAAAuwIAIBIAAL4CACATAAC_AgAgGQAAswQAIJ8BAQCvAgAhoAEBAK8CACGhAQEArwIAIaIBAQCwAgAhowEBALACACGkAQEAsAIAIaUBAQCwAgAhpgEBALACACGoAQAAsQKoASKqAQAAsgKqASKsAQAAswKsASKtASAAtAIAIa4BIAC0AgAhrwFAALUCACGwAUAAtgIAIbEBQAC2AgAhGAIAALcCACADAAC4AgAgBAAAuQIAIAkAALwCACAPAAC6AgAgEAAAuwIAIBIAAL4CACATAAC_AgAgnwEBAK8CACGgAQEArwIAIaEBAQCvAgAhogEBALACACGjAQEAsAIAIaQBAQCwAgAhpQEBALACACGmAQEAsAIAIagBAACxAqgBIqoBAACyAqoBIqwBAACzAqwBIq0BIAC0AgAhrgEgALQCACGvAUAAtQIAIbABQAC2AgAhsQFAALYCACEDAAAACQAgIAAAqQQAICEAALYEACASAAAACQAgAgAAkgMAIAcAALUDACAJAACTAwAgGQAAtgQAIJ8BAQCvAgAhqgEAAJADxwEisAFAALYCACGxAUAAtgIAIcABAQCvAgAhwgEBAK8CACHDARAAgAMAIcQBAQCwAgAhxQEBALACACHHAQEAsAIAIcgBQAC1AgAhyQEBAK8CACHKAQEAsAIAIRACAACSAwAgBwAAtQMAIAkAAJMDACCfAQEArwIAIaoBAACQA8cBIrABQAC2AgAhsQFAALYCACHAAQEArwIAIcIBAQCvAgAhwwEQAIADACHEAQEAsAIAIcUBAQCwAgAhxwEBALACACHIAUAAtQIAIckBAQCvAgAhygEBALACACEFnwEBAAAAAbABQAAAAAGxAUAAAAABzwEBAAAAAdABAQAAAAEJAgAA9QIAIAMAAOkCACAIAADoAgAgnwEBAAAAAbABQAAAAAGxAUAAAAAByQEBAAAAAc8BAQAAAAHQAQEAAAABAgAAABUAICAAALgEACADAAAAEwAgIAAAuAQAICEAALwEACALAAAAEwAgAgAA8wIAIAMAANoCACAIAADZAgAgGQAAvAQAIJ8BAQCvAgAhsAFAALYCACGxAUAAtgIAIckBAQCvAgAhzwEBAK8CACHQAQEArwIAIQkCAADzAgAgAwAA2gIAIAgAANkCACCfAQEArwIAIbABQAC2AgAhsQFAALYCACHJAQEArwIAIc8BAQCvAgAh0AEBAK8CACEEnwEBAAAAAbABQAAAAAHRAQEAAAAB0wEBAAAAAQEBAAIKAgQDAwYEBAgBCR8GDQALDwwFEB4FESAHEiEHEyIIAQEAAgEBAAIFAgACBw4CCRIGDQAKDhYHAgMAAggABQUCAAIDAAIIAAUMGggNAAkCCgAHCwACAQwbAAIJHAAOHQAGCSUADyMAECQAESYAEicAEygAAAEBAAIBAQACAw0AECYAEScAEgAAAAMNABAmABEnABIDAgACAwACCAAFAwIAAgMAAggABQMNABcmABgnABkAAAADDQAXJgAYJwAZAgoABwsAAgIKAAcLAAIDDQAeJgAfJwAgAAAAAw0AHiYAHycAIAIDAAIIAAUCAwACCAAFBQ0AJSYAKCcAKVgAJlkAJwAAAAAABQ0AJSYAKCcAKVgAJlkAJwICAAIHiwECAgIAAgeRAQIFDQAuJgAxJwAyWAAvWQAwAAAAAAAFDQAuJgAxJwAyWAAvWQAwAQEAAgEBAAIDDQA3JgA4JwA5AAAAAw0ANyYAOCcAOQEBAAIBAQACAw0APiYAPycAQAAAAAMNAD4mAD8nAEAAAAMNAEUmAEYnAEcAAAADDQBFJgBGJwBHFAIBFSkBFisBFywBGC0BGi8BGzEMHDINHTQBHjYMHzcOIjgBIzkBJDoMKD0PKT4TKj8HK0AHLEEHLUIHLkMHL0UHMEcMMUgUMkoHM0wMNE0VNU4HNk8HN1AMOFMWOVQaOlUIO1YIPFcIPVgIPlkIP1sIQF0MQV4bQmAIQ2IMRGMcRWQIRmUIR2YMSGkdSWohSmsGS2wGTG0GTW4GTm8GT3EGUHMMUXQiUnYGU3gMVHkjVXoGVnsGV3wMWn8kW4ABKlyBAQVdggEFXoMBBV-EAQVghQEFYYcBBWKJAQxjigErZI0BBWWPAQxmkAEsZ5IBBWiTAQVplAEMapcBLWuYATNsmgEEbZsBBG6dAQRvngEEcJ8BBHGhAQRyowEMc6QBNHSmAQR1qAEMdqkBNXeqAQR4qwEEeawBDHqvATZ7sAE6fLIBA32zAQN-tQEDf7YBA4ABtwEDgQG5AQOCAbsBDIMBvAE7hAG-AQOFAcABDIYBwQE8hwHCAQOIAcMBA4kBxAEMigHHAT2LAcgBQYwBygECjQHLAQKOAc0BAo8BzgECkAHPAQKRAdEBApIB0wEMkwHUAUKUAdYBApUB2AEMlgHZAUOXAdoBApgB2wECmQHcAQyaAd8BRJsB4AFI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  ConversationScalarFieldEnum: () => ConversationScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DonationRequestScalarFieldEnum: () => DonationRequestScalarFieldEnum,
  DonationScalarFieldEnum: () => DonationScalarFieldEnum,
  DonorScalarFieldEnum: () => DonorScalarFieldEnum,
  JsonNull: () => JsonNull2,
  MessageScalarFieldEnum: () => MessageScalarFieldEnum,
  ModelName: () => ModelName,
  NeedyScalarFieldEnum: () => NeedyScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  Conversation: "Conversation",
  Message: "Message",
  Donation: "Donation",
  DonationRequest: "DonationRequest",
  Donor: "Donor",
  Needy: "Needy",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ConversationScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  donorId: "donorId",
  needyId: "needyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MessageScalarFieldEnum = {
  id: "id",
  conversationId: "conversationId",
  senderId: "senderId",
  message: "message",
  createdAt: "createdAt"
};
var DonationScalarFieldEnum = {
  id: "id",
  amount: "amount",
  status: "status",
  paymentId: "paymentId",
  paymentStatus: "paymentStatus",
  donorId: "donorId",
  requestId: "requestId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DonationRequestScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  requiredAmount: "requiredAmount",
  situationVideo: "situationVideo",
  situationAudio: "situationAudio",
  status: "status",
  rejectionReason: "rejectionReason",
  reviewedAt: "reviewedAt",
  needyId: "needyId",
  reviewedById: "reviewedById",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DonorScalarFieldEnum = {
  id: "id",
  name: "name",
  phone: "phone",
  address: "address",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NeedyScalarFieldEnum = {
  id: "id",
  name: "name",
  phone: "phone",
  address: "address",
  description: "description",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  imageUrl: "imageUrl",
  phone: "phone",
  address: "address",
  googleId: "googleId",
  role: "role",
  status: "status",
  authProvider: "authProvider",
  emailVerified: "emailVerified",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  NEEDY: "NEEDY",
  DONOR: "DONOR",
  ADMIN: "ADMIN"
};
var AuthProvider = {
  CREDENTIAL: "CREDENTIAL",
  GOOGLE: "GOOGLE"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, _req, res, _next) => {
  console.log("Error from Global Error Handler:", err);
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = "Internal Server Error";
  const errors = [];
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      errorMessage = "Requested record was not found";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errors
  });
};

// src/app/module/admin/admin.route.ts
import { Router } from "express";

// src/app/middleware/checkAuth.ts
import httpStatus2 from "http-status";

// src/app/config/index.ts
import path2 from "path";
import dotenv from "dotenv";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bak_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  demo_admin_email: process.env.DEMO_ADMIN_EMAIL,
  demo_admin_password: process.env.DEMO_ADMIN_PASSWORD,
  demo_donor_email: process.env.DEMO_DONOR_EMAIL,
  demo_donor_password: process.env.DEMO_DONOR_PASSWORD,
  demo_needy_email: process.env.DEMO_NEEDY_EMAIL,
  demo_needy_password: process.env.DEMO_NEEDY_PASSWORD,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL
};

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/middleware/checkAuth.ts
var auth = (...requiredRoles) => {
  return catchAsync(
    async (req, _res, next) => {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new AppError(
          httpStatus2.UNAUTHORIZED,
          "You are not logged in. Please log in to access this resource."
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config_default.jwt_access_secret
      );
      if (!verifiedToken.success) {
        throw new AppError(httpStatus2.UNAUTHORIZED, verifiedToken.error);
      }
      const { email, name, userId, role } = verifiedToken.data;
      if (!email || !name || !userId || !role) {
        throw new AppError(
          httpStatus2.UNAUTHORIZED,
          "Invalid authentication token."
        );
      }
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus2.FORBIDDEN,
          "Forbidden. You don't have permission to access this resource."
        );
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
      if (!user) {
        throw new AppError(
          httpStatus2.UNAUTHORIZED,
          "User not found. Please log in again."
        );
      }
      if (user.email !== email || user.role !== role) {
        throw new AppError(
          httpStatus2.UNAUTHORIZED,
          "Invalid authentication token."
        );
      }
      if (user.status === "BLOCKED") {
        throw new AppError(
          httpStatus2.FORBIDDEN,
          "Your account has been blocked. Please contact support."
        );
      }
      req.user = {
        email: user.email,
        name: user.name,
        userId: user.id,
        role: user.role
      };
      next();
    }
  );
};

// src/app/module/admin/admin.controller.ts
import httpStatus4 from "http-status";

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/module/admin/admin.service.ts
import httpStatus3 from "http-status";
var getPendingDonationRequests = async (user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "Only admin can view pending donation requests"
    );
  }
  const requests = await prisma.donationRequest.findMany({
    where: {
      status: "PENDING"
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return requests;
};
var verifyDonationRequest = async (requestId, user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "Only admin can verify donation requests"
    );
  }
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus3.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus3.BAD_REQUEST,
      "Only pending donation requests can be verified"
    );
  }
  const verifiedRequest = await prisma.donationRequest.update({
    where: {
      id: requestId
    },
    data: {
      status: "VERIFIED",
      reviewedById: user.userId,
      reviewedAt: /* @__PURE__ */ new Date(),
      rejectionReason: null
    }
  });
  return verifiedRequest;
};
var rejectDonationRequest = async (requestId, rejectionReason, user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "Only admin can reject donation requests"
    );
  }
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus3.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus3.BAD_REQUEST,
      "Only pending donation requests can be rejected"
    );
  }
  const rejectedRequest = await prisma.donationRequest.update({
    where: {
      id: requestId
    },
    data: {
      status: "REJECTED",
      rejectionReason,
      reviewedById: user.userId,
      reviewedAt: /* @__PURE__ */ new Date()
    }
  });
  return rejectedRequest;
};
var getAllDonationRequests = async (user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "Only admin can view all donation requests"
    );
  }
  const requests = await prisma.donationRequest.findMany({
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return requests;
};
var getDonationRequestDetails = async (requestId, user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus3.FORBIDDEN,
      "Only admin can view donation request details"
    );
  }
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!donationRequest) {
    throw new AppError(
      httpStatus3.NOT_FOUND,
      "Donation request not found"
    );
  }
  return donationRequest;
};
var AdminService = {
  getPendingDonationRequests,
  verifyDonationRequest,
  rejectDonationRequest,
  getAllDonationRequests,
  getDonationRequestDetails
};

// src/app/module/admin/admin.controller.ts
var getPendingDonationRequests2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AdminService.getPendingDonationRequests(user);
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "Pending donation requests retrieved successfully",
      data: result
    });
  }
);
var verifyDonationRequest2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const result = await AdminService.verifyDonationRequest(requestId, user);
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "Donation request verified successfully",
      data: result
    });
  }
);
var rejectDonationRequest2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const { rejectionReason } = req.body;
    const result = await AdminService.rejectDonationRequest(
      requestId,
      rejectionReason,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "Donation request rejected successfully",
      data: result
    });
  }
);
var getAllDonationRequests2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AdminService.getAllDonationRequests(user);
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "All donation requests retrieved successfully",
      data: result
    });
  }
);
var getDonationRequestDetails2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const result = await AdminService.getDonationRequestDetails(
      requestId,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus4.OK,
      success: true,
      message: "Donation request details retrieved successfully",
      data: result
    });
  }
);
var AdminController = {
  getPendingDonationRequests: getPendingDonationRequests2,
  verifyDonationRequest: verifyDonationRequest2,
  rejectDonationRequest: rejectDonationRequest2,
  getAllDonationRequests: getAllDonationRequests2,
  getDonationRequestDetails: getDonationRequestDetails2
};

// src/app/module/admin/admin.route.ts
var router = Router();
router.get(
  "/donation-requests",
  auth("ADMIN"),
  AdminController.getAllDonationRequests
);
router.get(
  "/donation-requests/pending",
  auth("ADMIN"),
  AdminController.getPendingDonationRequests
);
router.get(
  "/donation-requests/:requestId",
  auth("ADMIN"),
  AdminController.getDonationRequestDetails
);
router.patch(
  "/donation-requests/:requestId/verify",
  auth("ADMIN"),
  AdminController.verifyDonationRequest
);
router.patch(
  "/donation-requests/:requestId/reject",
  auth("ADMIN"),
  AdminController.rejectDonationRequest
);
var AdminRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/middleware/validateRequest.ts
import httpStatus5 from "http-status";
var validateRequest = (zodSchema) => {
  return catchAsync(
    async (req, _res, next) => {
      const payload = req.body ?? {};
      const result = zodSchema.safeParse(payload);
      if (!result.success) {
        throw new AppError(
          httpStatus5.BAD_REQUEST,
          result.error.issues[0].message
        );
      }
      req.body = result.data;
      next();
    }
  );
};

// src/app/module/auth/auth.controller.ts
import httpStatus7 from "http-status";

// src/app/module/auth/auth.service.ts
import crypto from "crypto";
import path3 from "path";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import httpStatus6 from "http-status";

// src/app/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});
var connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

// src/app/module/auth/auth.utils.ts
var getSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  imageUrl: user.imageUrl,
  role: user.role,
  status: user.status,
  authProvider: user.authProvider,
  emailVerified: user.emailVerified
});

// src/app/module/auth/auth.service.ts
var registerUser = async (payload) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    imageUrl,
    role = Role.NEEDY
  } = payload;
  const normalizedEmail = email.trim().toLowerCase();
  if (role === Role.ADMIN) {
    throw new AppError(
      httpStatus6.FORBIDDEN,
      "Admin cannot be registered from this API"
    );
  }
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });
  if (isUserExists) {
    throw new AppError(
      httpStatus6.CONFLICT,
      "User with this email already exists"
    );
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds) || 10
  );
  const expirationSeconds = 5 * 60;
  const otpValue = crypto.randomInt(1e5, 1e6).toString();
  const otpKey = `daan-registration-otp:${normalizedEmail}`;
  await connectRedis();
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const registrationKey = `daan-registration-data:${normalizedEmail}`;
  const registrationData = {
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    address,
    imageUrl,
    role
  };
  await redisClient.set(registrationKey, JSON.stringify(registrationData), {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/registration-otp.ejs"
  );
  const templateData = {
    name,
    email: normalizedEmail,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: normalizedEmail,
    subject: "Daan - Email Verification",
    html
  });
};
var verifyEmail = async (payload) => {
  const { otp } = payload;
  const email = payload.email.trim().toLowerCase();
  const otpKey = `daan-registration-otp:${email}`;
  await connectRedis();
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Invalid or expired OTP");
  }
  if (redisOtp !== otp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "OTP does not match");
  }
  const registrationKey = `daan-registration-data:${email}`;
  const redisRegistrationData = await redisClient.get(registrationKey);
  if (!redisRegistrationData) {
    throw new AppError(
      httpStatus6.NOT_FOUND,
      "Registration data not found or expired"
    );
  }
  const registrationData = JSON.parse(
    redisRegistrationData
  );
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
        phone: registrationData.phone,
        address: registrationData.address,
        imageUrl: registrationData.imageUrl,
        role: registrationData.role ?? Role.NEEDY,
        status: UserStatus.ACTIVE,
        authProvider: AuthProvider.CREDENTIAL,
        emailVerified: true
      }
    });
    if (user.role === Role.NEEDY) {
      await tx.needy.create({
        data: {
          name: registrationData.name,
          phone: registrationData.phone,
          address: registrationData.address,
          userId: user.id
        }
      });
    }
    if (user.role === Role.DONOR) {
      await tx.donor.create({
        data: {
          name: registrationData.name,
          phone: registrationData.phone,
          address: registrationData.address,
          userId: user.id
        }
      });
    }
    return user;
  });
  await redisClient.del([otpKey, registrationKey]);
  const jwtPayload = {
    userId: result.id,
    name: result.name,
    email: result.email,
    role: result.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: getSafeUser(result),
    accessToken,
    refreshToken: refreshToken3
  };
};
var loginUser = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
  }
  if (!user.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "Please verify your email first");
  }
  if (!user.password) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "This account does not have a password"
    );
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus6.UNAUTHORIZED, "Invalid credentials");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: getSafeUser(user),
    accessToken,
    refreshToken: refreshToken3
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      needy: true,
      donor: true,
      admin: true
    }
  });
  if (!isUserExists) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
  }
  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
  }
  const { password, ...userData } = isUserExists;
  return userData;
};
var forgotPassword = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
  }
  if (!user.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "Please verify your email first");
  }
  if (!user.password) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "Google account cannot reset password this way"
    );
  }
  const otpValue = crypto.randomInt(1e5, 1e6).toString();
  const expirationSeconds = 5 * 60;
  const otpKey = `daan-forgot-password-otp:${email}`;
  await connectRedis();
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/password-reset-otp.ejs"
  );
  const templateData = {
    name: user.name,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Daan - Password Reset OTP",
    html
  });
};
var resetPassword = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const { otp, newPassword } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
  }
  if (!user.emailVerified) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is not verified");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
  }
  if (user.googleId && user.authProvider === AuthProvider.GOOGLE) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "User has an account with Google"
    );
  }
  const otpKey = `daan-forgot-password-otp:${email}`;
  await connectRedis();
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Invalid or expired OTP");
  }
  if (redisOtp !== otp) {
    throw new AppError(httpStatus6.BAD_REQUEST, "OTP does not match");
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds) || 10
  );
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      password: hashedPassword,
      authProvider: AuthProvider.CREDENTIAL
    }
  });
  await redisClient.del(otpKey);
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/password-reset-success.ejs"
  );
  const templateData = {
    name: user.name
  };
  const html = await ejs.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: user.email,
    subject: "Password Changed",
    html
  });
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(httpStatus6.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId
    }
  });
  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "User is inactive or not found"
    );
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "Invalid or expired Google ID token"
    );
  }
  if (!googleIdTokenPayload) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "Invalid or expired Google ID token"
    );
  }
  if (!googleIdTokenPayload.email) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Google email not found");
  }
  if (!googleIdTokenPayload.name) {
    throw new AppError(httpStatus6.BAD_REQUEST, "Google user name not found");
  }
  const email = googleIdTokenPayload.email.trim().toLowerCase();
  const googleId = googleIdTokenPayload.sub;
  let user = await prisma.user.findUnique({
    where: {
      googleId
    }
  });
  if (!user) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        throw new AppError(httpStatus6.FORBIDDEN, "Email is not verified");
      }
      if (existingUser.status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
      }
      if (existingUser.isDeleted || existingUser.status === UserStatus.DELETED) {
        throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
      }
      user = await prisma.user.update({
        where: {
          id: existingUser.id
        },
        data: {
          googleId,
          authProvider: AuthProvider.GOOGLE
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email,
          googleId,
          role: Role.NEEDY,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          needy: {
            create: {
              name: googleIdTokenPayload.name
            }
          }
        }
      });
      const templatePath = path3.join(
        process.cwd(),
        "src/app/templates/welcome.ejs"
      );
      const templateData = {
        name: user.name
      };
      const html = await ejs.renderFile(templatePath, templateData);
      await transporter.sendMail({
        from: config_default.email_sender,
        to: user.email,
        subject: "Welcome To Daan - Donate With Trust",
        html
      });
    }
  }
  if (!user) {
    throw new AppError(httpStatus6.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(httpStatus6.FORBIDDEN, "User is deleted");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: getSafeUser(user),
    accessToken,
    refreshToken: refreshToken3
  };
};
var demoLogin = async (role) => {
  const credentials = {
    [Role.ADMIN]: {
      email: config_default.demo_admin_email,
      password: config_default.demo_admin_password
    },
    [Role.DONOR]: {
      email: config_default.demo_donor_email,
      password: config_default.demo_donor_password
    },
    [Role.NEEDY]: {
      email: config_default.demo_needy_email,
      password: config_default.demo_needy_password
    }
  }[role];
  if (!credentials?.email || !credentials.password) {
    throw new AppError(
      httpStatus6.INTERNAL_SERVER_ERROR,
      `Demo ${role} credentials are missing in environment variables`
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      email: credentials.email.trim().toLowerCase()
    }
  });
  if (!user) {
    throw new AppError(
      httpStatus6.NOT_FOUND,
      `Demo ${role} user not found`
    );
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      httpStatus6.FORBIDDEN,
      "Demo user is blocked"
    );
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(
      httpStatus6.FORBIDDEN,
      "Demo user is deleted"
    );
  }
  if (user.role !== role) {
    throw new AppError(
      httpStatus6.BAD_REQUEST,
      "Demo user role does not match"
    );
  }
  if (!user.emailVerified) {
    throw new AppError(
      httpStatus6.FORBIDDEN,
      "Demo user email is not verified"
    );
  }
  if (!user.password || !await bcrypt.compare(credentials.password, user.password)) {
    throw new AppError(
      httpStatus6.UNAUTHORIZED,
      "Demo user credentials are invalid"
    );
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: getSafeUser(user),
    accessToken,
    refreshToken: refreshToken3
  };
};
var AuthService = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleLogin,
  demoLogin
};

// src/app/module/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.registerUser(payload);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Verification OTP sent to your email",
    data: null
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.verifyEmail(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Email verified successfully",
    data: {
      user
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      user
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      httpStatus7.UNAUTHORIZED,
      "User information is missing in the request"
    );
  }
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.forgotPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Password reset OTP sent to your email",
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  await AuthService.resetPassword(payload);
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Password reset successfully",
    data: null
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError(httpStatus7.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await AuthService.refreshToken(token);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var demoLogin2 = catchAsync(async (req, res) => {
  const { role } = req.body;
  const result = await AuthService.demoLogin(role);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Demo login successful",
    data: {
      user
    }
  });
});
var logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Logged out successfully",
    data: null
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Google login successful",
    data: {
      user
    }
  });
});
var AuthController = {
  registerUser: registerUser2,
  verifyEmail: verifyEmail2,
  loginUser: loginUser2,
  getMe: getMe2,
  refreshToken: refreshToken2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  googleLogin: googleLogin2,
  logout,
  demoLogin: demoLogin2
};

// src/app/module/auth/auth.validation.ts
import z from "zod";
var UserRegistrationZodSchema = z.object({
  name: z.string("Name must be a string").min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long").regex(/[a-z]/, "Password must contain at least 1 lowercase letter").regex(/[A-Z]/, "Password must contain at least 1 uppercase letter").regex(/[0-9]/, "Password must contain at least 1 number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 special character"
  ),
  phone: z.string().optional(),
  address: z.string().optional(),
  imageUrl: z.string().optional(),
  role: z.enum(["NEEDY", "DONOR"]).optional()
});
var EmailVerifyZodSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits")
  // .regex(/^\d+$/, "OTP must contain only numbers"),
});
var LoginZodSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long").regex(/[a-z]/, "Password must contain at least 1 lowercase letter").regex(/[A-Z]/, "Password must contain at least 1 uppercase letter").regex(/[0-9]/, "Password must contain at least 1 number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 special character"
  )
});
var GoogleLoginZodSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required")
});
var DemoLoginZodSchema = z.object({
  role: z.enum(["ADMIN", "DONOR", "NEEDY"])
});
var ForgotPasswordZodSchema = z.object({
  email: z.email("Invalid email")
});
var ResetPasswordZodSchema = z.object({
  email: z.email("Invalid email"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long").regex(/[a-z]/, "Password must contain at least 1 lowercase letter").regex(/[A-Z]/, "Password must contain at least 1 uppercase letter").regex(/[0-9]/, "Password must contain at least 1 number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 special character"
  ),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers")
});
var UserValidation = {
  UserRegistrationZodSchema,
  EmailVerifyZodSchema,
  LoginZodSchema,
  ForgotPasswordZodSchema,
  ResetPasswordZodSchema,
  GoogleLoginZodSchema,
  DemoLoginZodSchema
};

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post(
  "/register",
  validateRequest(UserValidation.UserRegistrationZodSchema),
  AuthController.registerUser
);
router2.post(
  "/verify-email",
  validateRequest(UserValidation.EmailVerifyZodSchema),
  AuthController.verifyEmail
);
router2.post(
  "/login",
  validateRequest(UserValidation.LoginZodSchema),
  AuthController.loginUser
);
router2.post("/logout", AuthController.logout);
router2.post(
  "/google-login",
  validateRequest(UserValidation.GoogleLoginZodSchema),
  AuthController.googleLogin
);
router2.get(
  "/me",
  auth(Role.ADMIN, Role.NEEDY, Role.DONOR),
  AuthController.getMe
);
router2.post(
  "/forgot-password",
  validateRequest(UserValidation.ForgotPasswordZodSchema),
  AuthController.forgotPassword
);
router2.post(
  "/reset-password",
  validateRequest(UserValidation.ResetPasswordZodSchema),
  AuthController.resetPassword
);
router2.post(
  "/demo-login",
  validateRequest(UserValidation.DemoLoginZodSchema),
  AuthController.demoLogin
);
router2.post("/refresh-token", AuthController.refreshToken);
var AuthRoutes = router2;

// src/app/module/communication/communication.route.ts
import { Router as Router3 } from "express";

// src/app/module/communication/communication.controller.ts
import httpStatus9 from "http-status";

// src/app/module/communication/communication.service.ts
import httpStatus8 from "http-status";
var createConversation = async (requestId, user) => {
  const donorUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!donorUser) {
    throw new AppError(httpStatus8.NOT_FOUND, "User not found");
  }
  if (donorUser.role !== "DONOR") {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "Only donors can start a conversation"
    );
  }
  if (donorUser.isDeleted || donorUser.status === "DELETED" || donorUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "Your account is not allowed to start a conversation"
    );
  }
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus8.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.status !== "VERIFIED") {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      "Conversation can only be started for a verified request"
    );
  }
  if (donationRequest.needyId === user.userId) {
    throw new AppError(
      httpStatus8.BAD_REQUEST,
      "You cannot start a conversation with yourself"
    );
  }
  const existingConversation = await prisma.conversation.findUnique({
    where: {
      requestId_donorId: {
        requestId,
        donorId: user.userId
      }
    }
  });
  if (existingConversation) {
    return existingConversation;
  }
  const conversation = await prisma.conversation.create({
    data: {
      requestId,
      donorId: user.userId,
      needyId: donationRequest.needyId
    }
  });
  return conversation;
};
var sendMessage = async (payload, user) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!currentUser) {
    throw new AppError(httpStatus8.NOT_FOUND, "User not found");
  }
  if (currentUser.isDeleted || currentUser.status === "DELETED" || currentUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "Your account is not allowed to send messages"
    );
  }
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: payload.conversationId
    }
  });
  if (!conversation) {
    throw new AppError(httpStatus8.NOT_FOUND, "Conversation not found");
  }
  if (conversation.donorId !== user.userId && conversation.needyId !== user.userId) {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }
  const trimmedMessage = payload.message.trim();
  if (!trimmedMessage) {
    throw new AppError(httpStatus8.BAD_REQUEST, "Message cannot be empty");
  }
  const newMessage = await prisma.message.create({
    data: {
      conversationId: payload.conversationId,
      senderId: user.userId,
      message: trimmedMessage
    }
  });
  return newMessage;
};
var getConversationMessages = async (conversationId, user) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    }
  });
  if (!conversation) {
    throw new AppError(httpStatus8.NOT_FOUND, "Conversation not found");
  }
  if (conversation.donorId !== user.userId && conversation.needyId !== user.userId) {
    throw new AppError(
      httpStatus8.FORBIDDEN,
      "You are not a participant of this conversation"
    );
  }
  const messages = await prisma.message.findMany({
    where: {
      conversationId
    },
    orderBy: {
      createdAt: "asc"
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          role: true,
          imageUrl: true
        }
      }
    }
  });
  return messages;
};
var CommunicationService = {
  createConversation,
  sendMessage,
  getConversationMessages
};

// src/app/module/communication/communication.controller.ts
var createConversation2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await CommunicationService.createConversation(
    req.params.requestId,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus9.CREATED,
    success: true,
    message: "Conversation created successfully",
    data: result
  });
});
var sendMessage2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await CommunicationService.sendMessage(req.body, user);
  sendResponse(res, {
    statusCode: httpStatus9.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result
  });
});
var getConversationMessages2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await CommunicationService.getConversationMessages(
      req.params.conversationId,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus9.OK,
      success: true,
      message: "Conversation messages retrieved successfully",
      data: result
    });
  }
);
var CommunicationController = {
  createConversation: createConversation2,
  sendMessage: sendMessage2,
  getConversationMessages: getConversationMessages2
};

// src/app/module/communication/communication.route.ts
var router3 = Router3();
router3.post(
  "/requests/:requestId",
  auth("DONOR"),
  CommunicationController.createConversation
);
router3.post(
  "/messages",
  auth("DONOR", "NEEDY"),
  CommunicationController.sendMessage
);
router3.get(
  "/conversations/:conversationId/messages",
  auth("DONOR", "NEEDY"),
  CommunicationController.getConversationMessages
);
var CommunicationRoutes = router3;

// src/app/module/donation/donation.route.ts
import { Router as Router4 } from "express";

// src/app/module/donation/donation.controller.ts
import httpStatus11 from "http-status";

// src/app/module/donation/donation.service.ts
import httpStatus10 from "http-status";
var createDonation = async (payload, user) => {
  const donorUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!donorUser) {
    throw new AppError(httpStatus10.NOT_FOUND, "User not found");
  }
  if (donorUser.role !== "DONOR") {
    throw new AppError(httpStatus10.FORBIDDEN, "Only donors can make donations");
  }
  if (donorUser.isDeleted || donorUser.status === "DELETED" || donorUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus10.FORBIDDEN,
      "Your account is not allowed to make donations"
    );
  }
  if (payload.amount <= 0) {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Donation amount must be greater than 0"
    );
  }
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: payload.requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus10.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.status !== "VERIFIED") {
    throw new AppError(
      httpStatus10.BAD_REQUEST,
      "Donation can only be made to a verified request"
    );
  }
  const donation = await prisma.donation.create({
    data: {
      amount: payload.amount,
      donorId: user.userId,
      requestId: payload.requestId,
      status: "PENDING",
      paymentStatus: "PENDING"
    }
  });
  return donation;
};
var getMyDonations = async (user) => {
  const donorUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!donorUser) {
    throw new AppError(httpStatus10.NOT_FOUND, "User not found");
  }
  if (donorUser.role !== "DONOR") {
    throw new AppError(
      httpStatus10.FORBIDDEN,
      "Only donors can view donation history"
    );
  }
  if (donorUser.isDeleted || donorUser.status === "DELETED" || donorUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus10.FORBIDDEN,
      "Your account is not allowed to view donation history"
    );
  }
  const donations = await prisma.donation.findMany({
    where: {
      donorId: user.userId
    },
    include: {
      request: {
        select: {
          id: true,
          title: true,
          description: true,
          requiredAmount: true,
          status: true,
          situationVideo: true,
          situationAudio: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return donations;
};
var getReceivedDonations = async (user) => {
  const needyUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!needyUser) {
    throw new AppError(httpStatus10.NOT_FOUND, "User not found");
  }
  if (needyUser.role !== "NEEDY") {
    throw new AppError(
      httpStatus10.FORBIDDEN,
      "Only needy users can view received donations"
    );
  }
  if (needyUser.isDeleted || needyUser.status === "DELETED" || needyUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus10.FORBIDDEN,
      "Your account is not allowed to view received donations"
    );
  }
  const donations = await prisma.donation.findMany({
    where: {
      request: {
        needyId: user.userId
      },
      status: "COMPLETED"
    },
    include: {
      request: {
        select: {
          id: true,
          title: true
        }
      },
      donor: {
        select: {
          id: true,
          name: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalReceived = donations.reduce(
    (total, donation) => total + Number(donation.amount),
    0
  );
  return {
    totalReceived,
    donations
  };
};
var DonationService = {
  createDonation,
  getMyDonations,
  getReceivedDonations
};

// src/app/module/donation/donation.controller.ts
var createDonation2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await DonationService.createDonation(req.body, user);
  sendResponse(res, {
    statusCode: httpStatus11.CREATED,
    success: true,
    message: "Donation created successfully",
    data: result
  });
});
var getMyDonations2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await DonationService.getMyDonations(user);
  sendResponse(res, {
    statusCode: httpStatus11.OK,
    success: true,
    message: "Donation history retrieved successfully",
    data: result
  });
});
var getReceivedDonations2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await DonationService.getReceivedDonations(user);
    sendResponse(res, {
      statusCode: httpStatus11.OK,
      success: true,
      message: "Received donations retrieved successfully",
      data: result
    });
  }
);
var DonationController = {
  createDonation: createDonation2,
  getMyDonations: getMyDonations2,
  getReceivedDonations: getReceivedDonations2
};

// src/app/module/donation/donation.route.ts
var router4 = Router4();
router4.post("/", auth("DONOR"), DonationController.createDonation);
router4.get(
  "/received",
  auth("NEEDY"),
  DonationController.getReceivedDonations
);
router4.get("/my-donations", auth("DONOR"), DonationController.getMyDonations);
var DonationRoutes = router4;

// src/app/module/donationRequest/donationRequest.route.ts
import { Router as Router5 } from "express";

// src/app/module/donationRequest/donationRequest.controller.ts
import httpStatus13 from "http-status";

// src/app/module/donationRequest/donationRequest.service.ts
import httpStatus12 from "http-status";
var createDonationRequest = async (payload, user) => {
  const needyUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!needyUser) {
    throw new AppError(httpStatus12.NOT_FOUND, "User not found");
  }
  if (needyUser.role !== "NEEDY") {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "Only needy users can create donation requests"
    );
  }
  if (needyUser.isDeleted || needyUser.status === "DELETED" || needyUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "Your account is not allowed to create donation requests"
    );
  }
  const donationRequest = await prisma.donationRequest.create({
    data: {
      title: payload.title,
      description: payload.description,
      requiredAmount: payload.requiredAmount,
      situationVideo: payload.situationVideo,
      situationAudio: payload.situationAudio,
      // The authenticated NEEDY user's ID
      needyId: user.userId
    }
  });
  return donationRequest;
};
var getDonationRequestById = async (requestId, user) => {
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      }
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus12.NOT_FOUND, "Donation request not found");
  }
  if (user.role === "ADMIN") {
    return donationRequest;
  }
  if (user.role === "DONOR") {
    if (donationRequest.status !== "VERIFIED") {
      throw new AppError(
        httpStatus12.FORBIDDEN,
        "Only verified donation requests can be viewed by donors"
      );
    }
    return donationRequest;
  }
  if (user.role === "NEEDY") {
    if (donationRequest.needyId !== user.userId) {
      throw new AppError(
        httpStatus12.FORBIDDEN,
        "You can only view your own donation requests"
      );
    }
    return donationRequest;
  }
  throw new AppError(
    httpStatus12.FORBIDDEN,
    "You don't have permission to view this donation request"
  );
};
var updateDonationRequest = async (requestId, payload, user) => {
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus12.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.needyId !== user.userId) {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "You can only update your own donation requests"
    );
  }
  if (donationRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "Only pending donation requests can be updated"
    );
  }
  const updatedDonationRequest = await prisma.donationRequest.update({
    where: {
      id: requestId
    },
    data: payload
  });
  return updatedDonationRequest;
};
var getMyDonationRequests = async (user) => {
  const donationRequests = await prisma.donationRequest.findMany({
    where: {
      needyId: user.userId
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return donationRequests;
};
var getVerifiedDonationRequests = async () => {
  const donationRequests = await prisma.donationRequest.findMany({
    where: {
      status: "VERIFIED"
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          address: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return donationRequests;
};
var deleteDonationRequest = async (requestId, user) => {
  const donationRequest = await prisma.donationRequest.findUnique({
    where: {
      id: requestId
    }
  });
  if (!donationRequest) {
    throw new AppError(httpStatus12.NOT_FOUND, "Donation request not found");
  }
  if (donationRequest.needyId !== user.userId) {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "You can only delete your own donation requests"
    );
  }
  if (donationRequest.status !== "PENDING") {
    throw new AppError(
      httpStatus12.FORBIDDEN,
      "Only pending donation requests can be deleted"
    );
  }
  await prisma.donationRequest.delete({
    where: {
      id: requestId
    }
  });
  return null;
};
var DonationRequestService = {
  createDonationRequest,
  getDonationRequestById,
  updateDonationRequest,
  deleteDonationRequest,
  getMyDonationRequests,
  getVerifiedDonationRequests
};

// src/app/module/donationRequest/donationRequest.validation.ts
import z2 from "zod";
var createDonationRequestZodSchema = z2.object({
  title: z2.string("Title must be a string").min(3, "Title must be at least 3 characters long").max(200, "Title cannot exceed 200 characters"),
  description: z2.string("Description must be a string").min(10, "Description must be at least 10 characters long"),
  requiredAmount: z2.number("Required amount must be a number").positive("Required amount must be greater than 0"),
  situationVideo: z2.string("Situation video must be a string").url("Situation video must be a valid URL").optional(),
  situationAudio: z2.string("Situation audio must be a string").url("Situation audio must be a valid URL").optional()
});
var updateDonationRequestZodSchema = z2.object({
  title: z2.string("Title must be a string").min(3, "Title must be at least 3 characters long").max(200, "Title cannot exceed 200 characters").optional(),
  description: z2.string("Description must be a string").min(10, "Description must be at least 10 characters long").optional(),
  requiredAmount: z2.number("Required amount must be a number").positive("Required amount must be greater than 0").optional(),
  situationVideo: z2.string("Situation video must be a string").url("Situation video must be a valid URL").optional(),
  situationAudio: z2.string("Situation audio must be a string").url("Situation audio must be a valid URL").optional()
});
var DonationRequestValidation = {
  createDonationRequestZodSchema,
  updateDonationRequestZodSchema
};

// src/app/module/donationRequest/donationRequest.controller.ts
var createDonationRequest2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError(
        httpStatus13.UNAUTHORIZED,
        "User information is missing in the request"
      );
    }
    const payload = DonationRequestValidation.createDonationRequestZodSchema.parse(req.body);
    const result = await DonationRequestService.createDonationRequest(
      payload,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus13.CREATED,
      success: true,
      message: "Donation request created successfully",
      data: result
    });
  }
);
var getDonationRequestById2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await DonationRequestService.getDonationRequestById(
      req.params.requestId,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus13.OK,
      success: true,
      message: "Donation request retrieved successfully",
      data: result
    });
  }
);
var updateDonationRequest2 = catchAsync(
  async (req, res) => {
    const payload = DonationRequestValidation.updateDonationRequestZodSchema.parse(req.body);
    const result = await DonationRequestService.updateDonationRequest(
      req.params.requestId,
      payload,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus13.OK,
      success: true,
      message: "Donation request updated successfully",
      data: result
    });
  }
);
var getMyDonationRequests2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError(
        httpStatus13.UNAUTHORIZED,
        "User information is missing in the request"
      );
    }
    const result = await DonationRequestService.getMyDonationRequests(user);
    sendResponse(res, {
      statusCode: httpStatus13.OK,
      success: true,
      message: "My donation requests retrieved successfully",
      data: result
    });
  }
);
var getVerifiedDonationRequests2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError(
        httpStatus13.UNAUTHORIZED,
        "User information is missing in the request"
      );
    }
    const result = await DonationRequestService.getVerifiedDonationRequests();
    sendResponse(res, {
      statusCode: httpStatus13.OK,
      success: true,
      message: "Verified donation requests retrieved successfully",
      data: result
    });
  }
);
var deleteDonationRequest2 = catchAsync(
  async (req, res) => {
    await DonationRequestService.deleteDonationRequest(
      req.params.requestId,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus13.OK,
      success: true,
      message: "Donation request deleted successfully",
      data: null
    });
  }
);
var DonationRequestController = {
  createDonationRequest: createDonationRequest2,
  getDonationRequestById: getDonationRequestById2,
  updateDonationRequest: updateDonationRequest2,
  deleteDonationRequest: deleteDonationRequest2,
  getMyDonationRequests: getMyDonationRequests2,
  getVerifiedDonationRequests: getVerifiedDonationRequests2
};

// src/app/module/donationRequest/donationRequest.route.ts
var router5 = Router5();
router5.post(
  "/",
  auth(Role.NEEDY),
  DonationRequestController.createDonationRequest
);
router5.get(
  "/verified",
  auth(Role.DONOR),
  DonationRequestController.getVerifiedDonationRequests
);
router5.get(
  "/my-requests",
  auth(Role.NEEDY),
  DonationRequestController.getMyDonationRequests
);
router5.get(
  "/:requestId",
  auth("ADMIN", "DONOR", "NEEDY"),
  DonationRequestController.getDonationRequestById
);
router5.patch(
  "/:requestId",
  auth(Role.NEEDY),
  DonationRequestController.updateDonationRequest
);
router5.delete(
  "/:requestId",
  auth(Role.NEEDY),
  DonationRequestController.deleteDonationRequest
);
var DonationRequestRoutes = router5;

// src/app/module/donor/donor.route.ts
import { Router as Router6 } from "express";

// src/app/module/donor/donor.controller.ts
import httpStatus15 from "http-status";

// src/app/module/donor/donor.service.ts
import httpStatus14 from "http-status";
var getVerifiedDonationRequests3 = async (user) => {
  const donorUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!donorUser) {
    throw new AppError(httpStatus14.NOT_FOUND, "User not found");
  }
  if (donorUser.role !== "DONOR") {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "Only donors can view verified donation requests"
    );
  }
  if (donorUser.isDeleted || donorUser.status === "DELETED" || donorUser.status === "BLOCKED") {
    throw new AppError(
      httpStatus14.FORBIDDEN,
      "Your account is not allowed to view donation requests"
    );
  }
  const donationRequests = await prisma.donationRequest.findMany({
    where: {
      status: "VERIFIED"
    },
    include: {
      needy: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return donationRequests;
};
var DonorService = {
  getVerifiedDonationRequests: getVerifiedDonationRequests3
};

// src/app/module/donor/donor.controller.ts
var getVerifiedDonationRequests4 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await DonorService.getVerifiedDonationRequests(user);
    sendResponse(res, {
      statusCode: httpStatus15.OK,
      success: true,
      message: "Verified donation requests retrieved successfully",
      data: result
    });
  }
);
var DonorController = {
  getVerifiedDonationRequests: getVerifiedDonationRequests4
};

// src/app/module/donor/donor.route.ts
var router6 = Router6();
router6.get(
  "/donation-requests",
  auth("DONOR"),
  DonorController.getVerifiedDonationRequests
);
var DonorRoutes = router6;

// src/app/module/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/module/payment/payment.controller.ts
import httpStatus18 from "http-status";

// src/app/module/payment/payment.service.ts
import httpStatus17 from "http-status";

// src/app/lib/bkash.ts
import httpStatus16 from "http-status";
var getBkashIdToken = async () => {
  try {
    await connectRedis();
    const IdTokenKey = "bkash:idToken";
    const RefreshTokenKey = "bkash:refreshToken";
    let bkashIdToken = await redisClient.get(IdTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);
    const bkashRefreshToken = await redisClient.get(RefreshTokenKey);
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey);
    if ((bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshToken && bkashRefreshTokenTTL > 600) {
      const refreshTokenResponse = await fetch(
        `${config_default.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config_default.bkash_username,
            password: config_default.bkash_password
          },
          body: JSON.stringify({
            app_key: config_default.bkash_app_key,
            app_secret: config_default.bkash_app_secret,
            refresh_token: bkashRefreshToken
          })
        }
      );
      if (!refreshTokenResponse.ok) {
        throw new AppError(
          httpStatus16.BAD_GATEWAY,
          "Bkash Access Token Grant Failed"
        );
      }
      const bkashRefreshTokenResult = await refreshTokenResponse.json();
      bkashIdToken = bkashRefreshTokenResult.id_token;
      await redisClient.set(IdTokenKey, bkashIdToken, {
        expiration: {
          type: "EX",
          value: 60 * 60
        }
      });
      return bkashIdToken;
    }
    if (bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    const response = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret
        })
      }
    );
    if (!response.ok) {
      throw new AppError(
        httpStatus16.BAD_GATEWAY,
        "Bkash Access Token Grant Failed"
      );
    }
    const result = await response.json();
    await redisClient.set(IdTokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60
        // 1hour
      }
    });
    await redisClient.set(RefreshTokenKey, result.refresh_token, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 28
        // 28 days
      }
    });
    bkashIdToken = result.id_token;
    return bkashIdToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(httpStatus16.BAD_GATEWAY, error.message);
  }
};

// src/app/module/payment/payment.service.ts
var createPayment = async (donationId, user) => {
  const donation = await prisma.donation.findUnique({
    where: {
      id: donationId
    },
    include: {
      request: true
    }
  });
  if (!donation) {
    throw new AppError(httpStatus17.NOT_FOUND, "Donation not found");
  }
  if (donation.donorId !== user.userId) {
    throw new AppError(
      httpStatus17.FORBIDDEN,
      "You are not allowed to pay for this donation"
    );
  }
  if (donation.status !== "PENDING") {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "This donation is not available for payment"
    );
  }
  if (donation.request.status !== "VERIFIED") {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Donation request is not verified"
    );
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(httpStatus17.BAD_GATEWAY, "Failed to get bKash ID token");
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: user.userId,
        callbackURL: config_default.bkash_callback_url,
        amount: donation.amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `DAAN-${donation.id}`
      })
    }
  );
  const result = await response.json();
  if (!response.ok || result.statusCode !== "0000") {
    throw new AppError(
      httpStatus17.BAD_GATEWAY,
      result.statusMessage || "bKash payment creation failed"
    );
  }
  await prisma.donation.update({
    where: {
      id: donation.id
    },
    data: {
      paymentId: result.paymentID,
      paymentStatus: "INITIATED"
    }
  });
  return {
    donationId: donation.id,
    paymentId: result.paymentID,
    bkashURL: result.bkashURL
  };
};
var executePayment = async (donationId, user) => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { request: true }
  });
  if (!donation) {
    throw new AppError(httpStatus17.NOT_FOUND, "Donation not found");
  }
  if (donation.donorId !== user.userId) {
    throw new AppError(
      httpStatus17.FORBIDDEN,
      "You are not allowed to execute this payment"
    );
  }
  if (!donation.paymentId) {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "Payment has not been created yet"
    );
  }
  if (donation.status === "COMPLETED") {
    throw new AppError(
      httpStatus17.BAD_REQUEST,
      "This donation has already been completed"
    );
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(httpStatus17.BAD_GATEWAY, "Failed to get bKash ID token");
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        paymentID: donation.paymentId
      })
    }
  );
  const result = await response.json();
  if (!response.ok || result.statusCode !== "0000") {
    throw new AppError(
      httpStatus17.BAD_GATEWAY,
      result.statusMessage || result.errorMessage || "bKash payment execution failed"
    );
  }
  const updatedDonation = await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: result.transactionStatus === "Completed" ? "COMPLETED" : "PENDING",
      paymentStatus: result.transactionStatus,
      paymentId: result.paymentID
    }
  });
  return {
    donationId: updatedDonation.id,
    paymentId: result.paymentID,
    trxID: result.trxID,
    amount: result.amount,
    transactionStatus: result.transactionStatus,
    paymentStatus: updatedDonation.paymentStatus
  };
};
var executePaymentByPaymentId = async (paymentId) => {
  const donation = await prisma.donation.findFirst({
    where: {
      paymentId
    }
  });
  if (!donation) {
    throw new AppError(httpStatus17.NOT_FOUND, "Donation not found");
  }
  if (donation.status === "COMPLETED") {
    return donation;
  }
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(httpStatus17.BAD_GATEWAY, "Failed to get bKash ID token");
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        paymentID: paymentId
      })
    }
  );
  const result = await response.json();
  if (!response.ok || result.statusCode !== "0000") {
    throw new AppError(
      httpStatus17.BAD_GATEWAY,
      result.statusMessage || result.errorMessage || "bKash payment execution failed"
    );
  }
  return prisma.donation.update({
    where: {
      id: donation.id
    },
    data: {
      status: result.transactionStatus === "Completed" ? "COMPLETED" : "PENDING",
      paymentStatus: result.transactionStatus,
      paymentId: result.paymentID
    }
  });
};
var PaymentService = {
  createPayment,
  executePayment,
  executePaymentByPaymentId
};

// src/app/module/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await PaymentService.createPayment(
    req.params.donationId,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "bKash payment created successfully",
    data: result
  });
});
var executePayment2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await PaymentService.executePayment(
    req.params.donationId,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus18.OK,
    success: true,
    message: "bKash payment executed successfully",
    data: result
  });
});
var bkashCallback = catchAsync(async (req, res) => {
  console.log("\u{1F525} NEW BKASH CALLBACK CODE RUNNING");
  const { paymentID, status } = req.query;
  if (!paymentID) {
    return res.status(httpStatus18.BAD_REQUEST).json({
      success: false,
      message: "Payment ID is missing"
    });
  }
  if (status === "cancel") {
    return res.status(httpStatus18.OK).json({
      success: false,
      message: "Payment cancelled"
    });
  }
  if (status === "failure") {
    return res.status(httpStatus18.BAD_REQUEST).json({
      success: false,
      message: "Payment failed"
    });
  }
  const donation = await PaymentService.executePaymentByPaymentId(
    paymentID
  );
  return res.redirect(
    `${config_default.frontend_url}/payment-success?donationId=${donation.id}`
  );
});
var PaymentController = {
  createPayment: createPayment2,
  executePayment: executePayment2,
  bkashCallback
};

// src/app/module/payment/payment.route.ts
var router7 = Router7();
router7.post(
  "/:donationId/create",
  auth("DONOR"),
  PaymentController.createPayment
);
router7.post(
  "/:donationId/execute",
  auth("DONOR"),
  PaymentController.executePayment
);
router7.get("/bkash/callback", PaymentController.bkashCallback);
var PaymentRoutes = router7;

// src/app/module/user/user.route.ts
import { Router as Router8 } from "express";

// src/app/module/user/user.controller.ts
import httpStatus20 from "http-status";

// src/app/module/user/user.service.ts
import httpStatus19 from "http-status";
var getAllUsers = async (user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus19.FORBIDDEN,
      "Only admin can view users"
    );
  }
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      email: {
        not: process.env.ADMIN_EMAIL
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      authProvider: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return users;
};
var getUserById = async (userId, user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus19.FORBIDDEN,
      "Only admin can view user details"
    );
  }
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      authProvider: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!foundUser) {
    throw new AppError(
      httpStatus19.NOT_FOUND,
      "User not found"
    );
  }
  return foundUser;
};
var updateUserStatus = async (userId, status, user) => {
  if (user.role !== "ADMIN") {
    throw new AppError(
      httpStatus19.FORBIDDEN,
      "Only admin can update user status"
    );
  }
  if (user.userId === userId) {
    throw new AppError(
      httpStatus19.BAD_REQUEST,
      "Admin cannot change their own status"
    );
  }
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false
    }
  });
  if (!foundUser) {
    throw new AppError(
      httpStatus19.NOT_FOUND,
      "User not found"
    );
  }
  if (foundUser.role === "ADMIN") {
    throw new AppError(
      httpStatus19.FORBIDDEN,
      "Admin user status cannot be changed"
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var UserService = {
  getAllUsers,
  getUserById,
  updateUserStatus
};

// src/app/module/user/user.controller.ts
var getCurrentUser = (req) => {
  if (!req.user) {
    throw new AppError(
      httpStatus20.UNAUTHORIZED,
      "Unauthorized"
    );
  }
  return req.user;
};
var getUserId = (req) => {
  const userId = req.params.userId;
  if (typeof userId !== "string") {
    throw new AppError(
      httpStatus20.BAD_REQUEST,
      "Invalid user ID"
    );
  }
  return userId;
};
var getAllUsers2 = catchAsync(
  async (req, res) => {
    const user = getCurrentUser(req);
    const result = await UserService.getAllUsers(user);
    res.status(httpStatus20.OK).json({
      success: true,
      statusCode: httpStatus20.OK,
      message: "Users retrieved successfully",
      data: result
    });
  }
);
var getUserById2 = catchAsync(
  async (req, res) => {
    const user = getCurrentUser(req);
    const userId = getUserId(req);
    const result = await UserService.getUserById(
      userId,
      user
    );
    res.status(httpStatus20.OK).json({
      success: true,
      statusCode: httpStatus20.OK,
      message: "User retrieved successfully",
      data: result
    });
  }
);
var updateUserStatus2 = catchAsync(
  async (req, res) => {
    const user = getCurrentUser(req);
    const userId = getUserId(req);
    const result = await UserService.updateUserStatus(
      userId,
      req.body.status,
      user
    );
    res.status(httpStatus20.OK).json({
      success: true,
      statusCode: httpStatus20.OK,
      message: "User status updated successfully",
      data: result
    });
  }
);
var UserController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserStatus: updateUserStatus2
};

// src/app/module/user/user.validation.ts
import { z as z3 } from "zod";
var updateUserStatusSchema = z3.object({
  status: z3.enum(["ACTIVE", "BLOCKED"])
});

// src/app/module/user/user.route.ts
var router8 = Router8();
router8.get(
  "/",
  auth("ADMIN"),
  UserController.getAllUsers
);
router8.get(
  "/:userId",
  auth("ADMIN"),
  UserController.getUserById
);
router8.patch(
  "/:userId/status",
  auth("ADMIN"),
  validateRequest(updateUserStatusSchema),
  UserController.updateUserStatus
);
var UserRoutes = router8;

// src/app.ts
var app = express();
var allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Daan Backend is running!"
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
app.use("/api/auth", AuthRoutes);
app.use("/api/donation-requests", DonationRequestRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/donor", DonorRoutes);
app.use("/api/donations", DonationRoutes);
app.use("/api/communication", CommunicationRoutes);
app.use("/api/payments", PaymentRoutes);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var port = Number(config_default.port) || 5e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    await redisClient.connect();
    console.log("Redis Connected Successfully.");
    await transporter.verify();
    console.log("Nodemailer Connected Successfully.");
    app_default.listen(port, () => {
      console.log(`Daan Backend is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.js.map