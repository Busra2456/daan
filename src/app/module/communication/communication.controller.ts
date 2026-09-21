import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import type { IRequestUser } from "../auth/auth.interface.js";
import { CommunicationService } from "./communication.service.js";

const createConversation = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await CommunicationService.createConversation(
		req.params.requestId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Conversation created successfully",
		data: result,
	});
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await CommunicationService.sendMessage(req.body, user);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Message sent successfully",
		data: result,
	});
});

const getConversationMessages = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const result = await CommunicationService.getConversationMessages(
			req.params.conversationId as string,
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Conversation messages retrieved successfully",
			data: result,
		});
	},
);

export const CommunicationController = {
	createConversation,
	sendMessage,
	getConversationMessages,
};
