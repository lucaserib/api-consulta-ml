// pages/api/categories.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const siteId = "MLB"; // Mercado Livre Brasil
  try {
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/${siteId}/categories`
    );
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar categorias", details: error.message });
  }
}
