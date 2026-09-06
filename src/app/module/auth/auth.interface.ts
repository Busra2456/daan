
import { Role } from "../../../../prisma/src/generated/prisma/enums";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  role?: Role;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}