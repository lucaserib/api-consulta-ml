import { useEffect, useState } from "react";
import axios from "axios";

export default function Penalidade() {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const { data } = await axios.get("/api/penalidade"); // Faz requisição para a API
        setPenalties(data);
      } catch (err: any) {
        console.error("Erro ao buscar penalidades:", err.message);
        setError("Não foi possível carregar as penalidades.");
      }
    };

    fetchPenalties();
  }, []);

  return (
    <div>
      <h1>Penalidades de Moderação</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : penalties.length > 0 ? (
        <ul>
          {penalties.map((penalty, index) => (
            <li key={index}>
              <strong>Motivo:</strong> {penalty.reason} <br />
              <strong>Status:</strong> {penalty.status} <br />
              <strong>Data:</strong> {new Date(penalty.date).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem penalidades de moderação no momento.</p>
      )}
    </div>
  );
}
