const API_URL = "https://smart-store-production-e7e1.up.railway.app";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Credenciales inválidas");
  }

  return data;
}
