
import type { Request, Response } from "express";
import httpStatus from "http-status";

import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import type { IRequestUser } from "./auth.interface";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    await AuthService.registerUser(payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Verification OTP sent to your email",
      data: null,
    });
  },
);
const verifyEmail = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.verifyEmail(payload);

    const {
      accessToken,
      refreshToken,
      user,
    } = result;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email verified successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  },
);;


const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await AuthService.loginUser(payload);

    const {
      accessToken,
      refreshToken,
      user,
    } = result;

    // Access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  },
);


const getMe = catchAsync(
  async (req: Request, res: Response) => {
    const user =
      req.user as unknown as IRequestUser;

    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User information is missing in the request",
      );
    }

    const result =
      await AuthService.getMe(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  },
);

const refreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const token =
      req.cookies.refreshToken;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Refresh token is missing",
      );
    }

    const result =
      await AuthService.refreshToken(token);

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = result;

    // New access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    // New refresh token cookie
    res.cookie(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  },
);

export const AuthController = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  refreshToken,
};
