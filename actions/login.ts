"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerficiationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTWoFActorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Inavlid Fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email Does Not Exist" };
  }

  if (!existingUser.emailVerified) {
    const verifcationToken = await generateVerficiationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verifcationToken?.email,
      verifcationToken?.token
    );
    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFActorEnabled && existingUser.email) {
    if (code) {
      // verfiy code
      const twoFActorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFActorToken) {
        return { error: "Invalid Code!" };
      }

      if (twoFActorToken.token !== code) {
        return { error: "Invalid Code!" };
      }

      const hasExpired = new Date(twoFActorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code Expired" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFActorToken.id,
        },
      });

      const existingConfirmation = await getTWoFActorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
