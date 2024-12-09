import { useEffect, useState } from "react";

const TestPage = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Faz uma requisição à API do Mercado Livre usando o access token gerado
      const response = await fetch("/api/test");

      if (!response.ok) {
        throw new Error("Erro ao obter dados: " + response.statusText);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!data) {
    return <div>Sem dados para exibir</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Teste de Requisição com Token</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        onClick={fetchData}
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Recarregar Dados
      </button>
    </div>
  );
};

export default TestPage;
