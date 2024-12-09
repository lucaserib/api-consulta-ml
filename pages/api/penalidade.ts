import type { NextApiRequest, NextApiResponse } from "next";
import { getValidAccessToken } from "../../utils/auth";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getValidAccessToken();

    const { data } = await axios.get(
      "https://api.mercadolibre.com/users/1164878601",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Retorna os dados da API
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Erro ao fazer a requisição autenticada:", error.message);

    // Trata erros mais detalhadamente
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Erro ao obter dados do Mercado Livre" });
    }
  }
}
