// pages/api/price-analysis.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const siteId = "MLB";
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "O parâmetro 'query' é obrigatório" });
  }

  try {
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/${siteId}/search?q=${query}`
    );
    res.status(200).json(data.results);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar preços", details: error.message });
  }
}
