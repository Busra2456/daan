
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: config.admin_email,
      },
    });

    if (existingAdmin) {
      console.log("Admin Already Exists!");
      return;
    }

    const name = config.admin_name;
    const email = config.admin_email;
    const password = config.admin_password;

    if (!name || !email || !password) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Admin Name, Email, Password Missing In Env File!!!",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        status: "ACTIVE",
        emailVerified: true,
        isDeleted: false,
      },
    });

    console.log("Admin Created:", admin.email);
  } catch (error) {
    console.log("Error Seeding Admin:", error);
  }
};

// Run seed
seedAdmin()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

