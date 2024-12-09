// pages/api/deals.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const siteId = "MLB";
  const dealId = req.query.deal || "MLB1234"; // Substitua pelo deal ID correto

  try {
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/${siteId}/search?deal=${dealId}`
    );
    res.status(200).json(data.results);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar ofertas", details: error.message });
  }
}
