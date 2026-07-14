"use client";

import { AuthContext, AuthContextType } from "@/context/auth.context";
import { useContext } from "react";

export function useAuth(): AuthContextType {
    return useContext(AuthContext);
}
