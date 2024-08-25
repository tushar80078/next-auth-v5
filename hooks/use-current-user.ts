import { useSession } from "next-auth/react";
import React from "react";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
