import { db } from "@/lib/db";

export const getPasswordTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return passwordToken;
  } catch (error) {
    return null;
  }
};
