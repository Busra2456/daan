import type { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinary } from "../../lib/cloudinary.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import type { IRequestUser } from "../auth/auth.interface.js";
import { DonationRequestService } from "./donationRequest.service.js";
import { DonationRequestValidation } from "./donationRequest.validation.js";



const uploadSituationImageToCloudinary = (
  file: Express.Multer.File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "daan/situation-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Image upload failed."));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
};


const createDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		if (!user) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"User information is missing in the request",
			);
		}

		const payload =
			DonationRequestValidation.createDonationRequestZodSchema.parse(req.body);

			const situationImage = req.file
      ? await uploadSituationImageToCloudinary(req.file)
      : undefined;


		const result = await DonationRequestService.createDonationRequest(
			{...payload,
			situationImage,},
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			message: "Donation request created successfully",
			data: result,
		});
	},
);
const getDonationRequestById = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const result = await DonationRequestService.getDonationRequestById(
			req.params.requestId as string,
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request retrieved successfully",
			data: result,
		});
	},
);

const updateDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		const payload =
  DonationRequestValidation.updateDonationRequestZodSchema.parse(req.body);
		const result = await DonationRequestService.updateDonationRequest(
			req.params.requestId as string,
			payload,
			req.user!,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request updated successfully",
			data: result,
		});
	},
);

const getMyDonationRequests = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		if (!user) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"User information is missing in the request",
			);
		}

		const result =
			await DonationRequestService.getMyDonationRequests(user);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "My donation requests retrieved successfully",
			data: result,
		});
	},
);


const getVerifiedDonationRequests = catchAsync(
  async (_req: Request, res: Response) => {
    const result =
      await DonationRequestService.getVerifiedDonationRequests();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Verified donation requests retrieved successfully",
      data: result,
    });
  },
);


// const getVerifiedDonationRequests = catchAsync(
// 	async (req: Request, res: Response) => {
// 		const user = req.user as unknown as IRequestUser;

// 		if (!user) {
// 			throw new AppError(
// 				httpStatus.UNAUTHORIZED,
// 				"User information is missing in the request",
// 			);
// 		}

// 		const result =
// 			await DonationRequestService.getVerifiedDonationRequests();

// 		sendResponse(res, {
// 			statusCode: httpStatus.OK,
// 			success: true,
// 			message: "Verified donation requests retrieved successfully",
// 			data: result,
// 		});
// 	},
// );

const deleteDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		await DonationRequestService.deleteDonationRequest(
			req.params.requestId as string,
			req.user!,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request deleted successfully",
			data: null,
		});
	},
);

export const DonationRequestController = {
	createDonationRequest,
	getDonationRequestById,
	updateDonationRequest,
	deleteDonationRequest,
	getMyDonationRequests,
	getVerifiedDonationRequests,
	uploadSituationImageToCloudinary
};
