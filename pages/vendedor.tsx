import axios from "axios";
import { useEffect, useState } from "react";

interface VendedorData {
  vendedor: {
    id: number;
    nickname: string;
    email: string;
    registration_date: string;
    status: string;
    reputation_level: string;
    power_seller_status: string;
    total_transactions: number;
  };
  reputacao: {
    level: string;
    claims: number;
    cancellations: number;
    delayed_handling_time: number;
  };
}

const Vendedor = () => {
  const [vendedorData, setVendedorData] = useState<VendedorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "1164878601"; // Substitua pelo user_id desejado
        const { data } = await axios.get(`/api/vendedor?user_id=${userId}`);
        setVendedorData(data);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar os dados do vendedor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Dados do Vendedor</h1>
      <h2>Vendedor</h2>
      <p>
        <strong>ID:</strong> {vendedorData?.vendedor.id}
      </p>
      <p>
        <strong>Apelido:</strong> {vendedorData?.vendedor.nickname}
      </p>
      <p>
        <strong>E-mail:</strong> {vendedorData?.vendedor.email}
      </p>
      <p>
        <strong>Data de registro:</strong>{" "}
        {new Date(
          vendedorData?.vendedor.registration_date || ""
        ).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {vendedorData?.vendedor.status}
      </p>
      <p>
        <strong>Nível de reputação:</strong>{" "}
        {vendedorData?.vendedor.reputation_level || "Indisponível"}
      </p>
      <p>
        <strong>Power Seller Status:</strong>{" "}
        {vendedorData?.vendedor.power_seller_status || "Indisponível"}
      </p>
      <p>
        <strong>Total de Transações:</strong>{" "}
        {vendedorData?.vendedor.total_transactions || 0}
      </p>

      {vendedorData?.reputacao ? (
        <>
          <h2>Reputação</h2>
          <p>
            <strong>Nível:</strong> {vendedorData.reputacao.level}
          </p>
          <p>
            <strong>Taxa de reclamações:</strong>{" "}
            {(vendedorData.reputacao.claims ?? 0) * 100}%
          </p>
          <p>
            <strong>Taxa de cancelamentos:</strong>{" "}
            {(vendedorData.reputacao.cancellations ?? 0) * 100}%
          </p>
          <p>
            <strong>Taxa de atrasos no manuseio:</strong>{" "}
            {(vendedorData.reputacao.delayed_handling_time ?? 0) * 100}%
          </p>
        </>
      ) : (
        <p>Reputação indisponível</p>
      )}
    </div>
  );
};

export default Vendedor;
