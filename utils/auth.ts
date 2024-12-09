import fs from "fs";
import path from "path";
import axios from "axios";
import { TokenResponse, Tokens } from "../types/auth";

const TOKEN_FILE_PATH = path.resolve("data/tokens.json");

const saveTokens = (tokens: Tokens) => {
  fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokens, null, 2));
};

export const loadTokens = (): Tokens | null => {
  if (!fs.existsSync(TOKEN_FILE_PATH)) return null;
  const data = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
  return JSON.parse(data);
};

export const getAccessToken = async (code: string): Promise<Tokens> => {
  try {
    const response = await axios.post<TokenResponse>(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        code,
        redirect_uri: process.env.REDIRECT_URI!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    const tokens: Tokens = {
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000,
    };

    saveTokens(tokens);
    console.log("Tokens gerados e salvos com sucesso:", tokens);
    return tokens;
  } catch (error) {
    console.error("Erro ao gerar access token:", error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<Tokens> => {
  const currentTokens = loadTokens();
  if (!currentTokens || !currentTokens.refresh_token) {
    throw new Error(
      "Refresh token não encontrado. Você precisa gerar o primeiro token."
    );
  }

  try {
    const response = await axios.post<TokenResponse>(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        refresh_token: currentTokens.refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    const tokens: Tokens = {
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000,
    };

    saveTokens(tokens);
    console.log("Access token renovado com sucesso:", tokens);
    return tokens;
  } catch (error) {
    console.error("Erro ao renovar access token:", error);
    throw error;
  }
};

export const getValidAccessToken = async (): Promise<string> => {
  const currentTokens = loadTokens();

  if (
    currentTokens &&
    currentTokens.expires_at &&
    Date.now() < currentTokens.expires_at
  ) {
    if (currentTokens.access_token) {
      return currentTokens.access_token;
    }
    throw new Error("Access token is null");
  }

  const newTokens = await refreshAccessToken();
  if (newTokens.access_token) {
    return newTokens.access_token;
  }
  throw new Error("Failed to refresh access token");
};
