import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommunicationService } from "./communication.service";
const createConversation = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await CommunicationService.createConversation(req.params.requestId, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Conversation created successfully",
        data: result,
    });
});
const sendMessage = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await CommunicationService.sendMessage(req.body, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});
const getConversationMessages = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await CommunicationService.getConversationMessages(req.params.conversationId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Conversation messages retrieved successfully",
        data: result,
    });
});
export const CommunicationController = {
    createConversation,
    sendMessage,
    getConversationMessages,
};
