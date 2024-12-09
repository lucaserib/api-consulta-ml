import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../../utils/auth.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const tokens = await getAccessToken(code);
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Erro ao processar o token:", error);
    res.status(500).json({ error: "Erro ao gerar token" });
  }
}
