import type { NextApiRequest, NextApiResponse } from "next";
import { getValidAccessToken } from "../../utils/auth";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Obtém um token válido (renova se necessário)
    const token = await getValidAccessToken();

    // Faz a requisição autenticada à API do Mercado Livre
    const { data } = await axios.get("https://api.mercadolibre.com/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Erro ao fazer a requisição autenticada:", error.message);
    res.status(500).json({ error: "Erro ao obter dados do Mercado Livre" });
  }
}
