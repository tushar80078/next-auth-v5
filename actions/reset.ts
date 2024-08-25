"use server";
import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schemas";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResettoken } from "@/lib/tokens";
import { error } from "console";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Emails!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email Not Found" };
  }

  const passwordResetToken = await generatePasswordResettoken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  //   Todo:ge

  return { success: "Reset Email Send" };
};
