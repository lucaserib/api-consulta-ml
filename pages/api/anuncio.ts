import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getValidAccessToken } from "../../utils/auth"; // Função para recuperar o token válido.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { item_id } = req.query;

  if (!item_id) {
    return res
      .status(400)
      .json({ error: "O parâmetro 'item_id' é obrigatório" });
  }

  try {
    const token = await getValidAccessToken();

    // Buscar detalhes do anúncio
    const { data: itemData } = await axios.get(
      `https://api.mercadolibre.com/items/${item_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Buscar descrição do anúncio
    const { data: descriptionData } = await axios.get(
      `https://api.mercadolibre.com/items/${item_id}/description`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const response = {
      id: itemData.id,
      title: itemData.title,
      price: itemData.price,
      currency: itemData.currency_id,
      available_quantity: itemData.available_quantity,
      sold_quantity: itemData.sold_quantity,
      permalink: itemData.permalink,
      thumbnail: itemData.thumbnail,
      views: itemData.official_store_id || "Dados não disponíveis",
      description: descriptionData.plain_text || "Sem descrição disponível",
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Erro ao buscar dados do anúncio:", error);
    return res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || "Erro interno" });
  }
}
