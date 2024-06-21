import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const vereficiationToken = await db.verficationToken.findFirst({
      where: { email },
    });

    return vereficiationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const vereficiationToken = await db.verficationToken.findUnique({
      where: { token },
    });

    return vereficiationToken;
  } catch (error) {
    return null;
  }
};
