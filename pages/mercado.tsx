import axios from "axios";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Mercado = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categorias
        const { data: categoryData } = await axios.get("/api/categories");
        setCategories(categoryData);

        // Fetch produtos iniciais
        const { data: productData } = await axios.get(
          "/api/price-analysis?query=smartphone"
        );
        setProducts(productData);

        // Fetch ofertas
        const { data: dealData } = await axios.get("/api/deals");
        setDeals(dealData);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar dados do mercado");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  // Gráfico de categorias
  const categoryChartData = categories.map((category: any) => ({
    name: category.name,
    total: category.total_items_in_this_category,
  }));

  // Cores para o gráfico de pizza
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28"];

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Análises de Mercado
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gráfico de Categorias */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3">Categorias Populares</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Produtos em Ofertas */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3">Produtos em Ofertas</h2>
          <ul>
            {deals.slice(0, 5).map((deal: any) => (
              <li
                key={deal.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <span>{deal.title}</span>
                <span className="font-bold text-green-600">
                  R$ {deal.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div className="mt-10 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">
          Produtos em {selectedCategory || "Geral"}
        </h2>
        <div className="flex justify-between items-center mb-5">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <ul>
          {products.slice(0, 10).map((product: any) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <span>{product.title}</span>
              <span className="font-bold text-blue-600">
                R$ {product.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gráfico de Pizza - Categorias */}
      <div className="mt-10 bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Distribuição de Categorias</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryChartData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categoryChartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Mercado;
