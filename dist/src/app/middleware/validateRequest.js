import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
export const validateRequest = (zodSchema) => {
    return catchAsync(async (req, _res, next) => {
        const payload = req.body ?? {};
        const result = zodSchema.safeParse(payload);
        if (!result.success) {
            throw new AppError(httpStatus.BAD_REQUEST, result.error.issues[0].message);
        }
        req.body = result.data;
        next();
    });
};
