import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getValidAccessToken } from "../../utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "O parâmetro 'user_id' é obrigatório" });
  }

  try {
    const token = await getValidAccessToken();
    console.log("Token de acesso:", token);

    // Realiza as requisições individualmente
    const userData = await axios.get(
      `https://api.mercadolibre.com/users/${user_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    let reputationData = null;
    try {
      // Tente buscar a reputação, mas continue se der erro
      reputationData = await axios.get(
        `https://api.mercadolibre.com/users/${user_id}/reputation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.warn(
        "Reputação indisponível para este vendedor:",
        (err as any).message
      );
    }

    // Monta a resposta com dados disponíveis
    const response = {
      vendedor: {
        id: userData.data.id,
        nickname: userData.data.nickname,
        email: userData.data.email || "Não permitido",
        registration_date: userData.data.registration_date,
        status: userData.data.status?.site_status || "Indisponível",
        reputation_level:
          userData.data.seller_reputation?.level_id || "Não disponível",
        power_seller_status:
          userData.data.seller_reputation?.power_seller_status ||
          "Não disponível",
        total_transactions:
          userData.data.seller_reputation?.transactions?.total || 0,
      },
      reputacao: reputationData
        ? {
            level: reputationData.data.level_id || "Não disponível",
            claims: reputationData.data.claims || 0,
            cancellations: reputationData.data.cancellations || 0,
            delayed_handling_time:
              reputationData.data.delayed_handling_time || 0,
          }
        : null,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Erro ao buscar dados do vendedor:", error.message);

    res.status(500).json({
      error: "Erro ao buscar dados do vendedor",
      details: error.message,
    });
  }
}
