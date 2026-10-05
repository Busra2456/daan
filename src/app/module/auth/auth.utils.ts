import { User } from "../../../generated/prisma/client";

export const getSafeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  imageUrl: user.imageUrl,
  role: user.role,
  status: user.status,
  authProvider: user.authProvider,
  emailVerified: user.emailVerified,
});

