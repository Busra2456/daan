import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { CommunicationController } from "./communication.controller";

const router = Router();

router.post(
	"/requests/:requestId",
	auth("DONOR"),
	CommunicationController.createConversation,
);

router.post(
	"/messages",
	auth("DONOR", "NEEDY"),
	CommunicationController.sendMessage,
);

router.get(
	"/conversations/:conversationId/messages",
	auth("DONOR", "NEEDY"),
	CommunicationController.getConversationMessages,
);

export const CommunicationRoutes = router;
