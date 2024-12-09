import axios from "axios";
import { useState, useEffect } from "react";

const Anuncio = () => {
  const [anuncioData, setAnuncioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemId = "MLB3801952289"; // Substitua por um ID dinâmico se necessário

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/anuncio?item_id=${itemId}`);
        setAnuncioData(data);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar os dados do anúncio");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Detalhes do Anúncio
      </h1>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <img
          src={anuncioData?.thumbnail}
          alt={anuncioData?.title}
          className="w-full h-64 object-contain mb-5"
        />
        <h2 className="text-2xl font-bold mb-3">{anuncioData?.title}</h2>
        <p>
          <strong>Preço:</strong> R$ {anuncioData?.price.toFixed(2)}
        </p>
        <p>
          <strong>Quantidade Disponível:</strong>{" "}
          {anuncioData?.available_quantity}
        </p>
        <p>
          <strong>Vendas Totais:</strong> {anuncioData?.sold_quantity}
        </p>
        <p>
          <strong>Link:</strong>{" "}
          <a
            href={anuncioData?.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Ver no Mercado Livre
          </a>
        </p>
        <p className="mt-5">
          <strong>Descrição:</strong>
        </p>
        <p className="bg-gray-100 p-3 rounded-lg">{anuncioData?.description}</p>
      </div>
    </div>
  );
};

export default Anuncio;
