import { Router } from "express";

import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middleware/checkAuth.js";
import { SSLCommerzController } from "./sslcommerz.controller.js";

const router = Router();

router.post(
	"/create/:donationId",
	auth(Role.DONOR),
	SSLCommerzController.createPayment,
);

router.post(
	"/success",
	SSLCommerzController.success,
);

router.post(
	"/fail",
	SSLCommerzController.fail,
);

router.post(
	"/cancel",
	SSLCommerzController.cancel,
);

router.post(
	"/ipn",
	SSLCommerzController.ipn,
);

export const SSLCommerzRoutes = router;