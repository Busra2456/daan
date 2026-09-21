import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
const createConversation = async (requestId, user) => {
    const donorUser = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
    });
    if (!donorUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (donorUser.role !== "DONOR") {
        throw new AppError(httpStatus.FORBIDDEN, "Only donors can start a conversation");
    }
    if (donorUser.isDeleted ||
        donorUser.status === "DELETED" ||
        donorUser.status === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is not allowed to start a conversation");
    }
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (donationRequest.status !== "VERIFIED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Conversation can only be started for a verified request");
    }
    if (donationRequest.needyId === user.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot start a conversation with yourself");
    }
    const existingConversation = await prisma.conversation.findUnique({
        where: {
            requestId_donorId: {
                requestId,
                donorId: user.userId,
            },
        },
    });
    if (existingConversation) {
        return existingConversation;
    }
    const conversation = await prisma.conversation.create({
        data: {
            requestId,
            donorId: user.userId,
            needyId: donationRequest.needyId,
        },
    });
    return conversation;
};
const sendMessage = async (payload, user) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
    });
    if (!currentUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (currentUser.isDeleted ||
        currentUser.status === "DELETED" ||
        currentUser.status === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is not allowed to send messages");
    }
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: payload.conversationId,
        },
    });
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
    }
    if (conversation.donorId !== user.userId &&
        conversation.needyId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not a participant of this conversation");
    }
    const trimmedMessage = payload.message.trim();
    if (!trimmedMessage) {
        throw new AppError(httpStatus.BAD_REQUEST, "Message cannot be empty");
    }
    const newMessage = await prisma.message.create({
        data: {
            conversationId: payload.conversationId,
            senderId: user.userId,
            message: trimmedMessage,
        },
    });
    return newMessage;
};
const getConversationMessages = async (conversationId, user) => {
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
    });
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
    }
    if (conversation.donorId !== user.userId &&
        conversation.needyId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not a participant of this conversation");
    }
    const messages = await prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    imageUrl: true,
                },
            },
        },
    });
    return messages;
};
export const CommunicationService = {
    createConversation,
    sendMessage,
    getConversationMessages,
};
