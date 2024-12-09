import { loadTokens, refreshAccessToken } from "./auth";

const CHECK_INTERVAL = 5 * 60 * 1000; // Verificar a cada 5 minutos.

export const startTokenScheduler = () => {
  setInterval(async () => {
    try {
      const tokens = loadTokens();

      // Se o token estiver para expirar em menos de 10 minutos, renove-o.
      if (
        tokens &&
        tokens.expires_at &&
        tokens.expires_at - Date.now() < 10 * 60 * 1000
      ) {
        console.log("Renovando o token...");
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Erro ao verificar/renovar o token:", error);
    }
  }, CHECK_INTERVAL);
};
