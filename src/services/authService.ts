import api from "../lib/axios.config";
import type { LoginResponse } from "../types/auth";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data as LoginResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Credenciales inválidas");
  }
}
