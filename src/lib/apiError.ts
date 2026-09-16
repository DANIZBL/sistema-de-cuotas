import axios from "axios";

/**
 * Traduce cualquier error de una llamada HTTP a un mensaje mostrable al usuario.
 * Axios rechaza la promesa ante cualquier status fuera de 2xx, así que el manejo
 * de 401/403/etc. va acá y no revisando `response.status` después del await.
 */
export function toApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
            return "La sesión expiró. Volvé a iniciar sesión.";
        }

        if (status === 403) {
            return "No tenés permisos para realizar esta acción.";
        }

        const message = (error.response?.data as { message?: unknown } | undefined)
            ?.message;

        if (typeof message === "string" && message.trim()) {
            return message;
        }

        if (!error.response) {
            return "No pudimos conectarnos con el servidor.";
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
}
