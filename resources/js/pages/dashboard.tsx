import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Função para renderizar o rótulo do status no gráfico de pizza
const renderStatusLabel = (entry: any) => {
  const config = statusConfig[entry.name] || statusConfig["Desconhecido"];
  return `${config.icon} ${entry.name}`;
};

// Função para renderizar o rótulo da opção no gráfico de pizza
const renderOptionLabel = (entry: any) => {
  return entry.name;
};

// Configuração de cores e ícones para status
const statusConfig = {
  "Ganhou": { color: "#10b981", icon: "✅" },
  "Perdeu": { color: "#ef4444", icon: "❌" },
  "Cancelada": { color: "#6b7280", icon: "🚫" },
  "Aguardando": { color: "#f59e0b", icon: "⏳" },
  "Desconhecido": { color: "#9ca3af", icon: "❓" },
};

// Cores para o gráfico de tipos de apostas
const optionColors = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#14b8a6",
  "#06b6d4",
  "#6366f1",
];

// Formatador de dinheiro
const formatMoney = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatador de porcentagem
const formatPercent = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

interface Bet {
  time_casa: string;
  time_visitante: string;
  amount: number;
  odd_at_bet: number;
  status_name: string;
  data_jogo: string;
  return_amount: number;
  lucro: number;
}

interface DashboardData {
  total_bets: number;
  total_amount: number;
  total_return: number;
  profit: number;
  roi: number;
  bets_by_status: {
    status_id: number;
    status_name: string;
    total: number;
  }[];
  bets_by_option: {
    bet_option: number;
    option_name: string;
    total: number;
  }[];
  profit_per_day: {
    date: string;
    profit: number;
  }[];
  latest_bets: Bet[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<DashboardData>("/api/dashboard")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Erro ao carregar dados do dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AppLayout>
        <Head title="Dashboard" />
        <div className="p-6">
          <p className="text-center">Carregando dados...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title="Dashboard" />
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Apostas</p>
              <p className="text-2xl font-bold">{data.total_bets}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Valor Apostado</p>
              <p className="text-2xl font-bold">{formatMoney(data.total_amount)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Retorno Total</p>
              <p className="text-2xl font-bold">{formatMoney(data.total_return)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
              <p
                className={`text-2xl font-bold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatMoney(data.profit)} ({formatPercent(data.roi)})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de linha - Lucro por dia */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="mb-2 font-medium">Lucro por Dia</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.profit_per_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip
                  formatter={(value: number) => [formatMoney(value), "Lucro"]}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráficos de pizza */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 font-medium">Apostas por Status</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.bets_by_status}
                    dataKey="total"
                    nameKey="status_name"
                    outerRadius={100}
                    label={renderStatusLabel}
                  >
                    {data.bets_by_status.map((entry, i) => {
                      const config = statusConfig[entry.status_name] ?? statusConfig["Desconhecido"];
                      return <Cell key={i} fill={config.color} />;
                    })}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string, props: { payload: { total: number; status_name: string } }) => {
                      const { payload } = props;
                      const total = data.bets_by_status.reduce((sum, s) => sum + s.total, 0);
                      const percent = ((payload.total / total) * 100).toFixed(1);
                      const config = statusConfig[payload.status_name] ?? statusConfig["Desconhecido"];

                      return [
                        `${payload.total} apostas (${percent}%)`,
                        `${config.icon} ${payload.status_name}`
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="mb-2 font-medium">Apostas por Tipo</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.bets_by_option}
                    dataKey="total"
                    nameKey="option_name"
                    outerRadius={100}
                    label={renderOptionLabel}
                  >
                    {data.bets_by_option.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={optionColors[i % optionColors.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string, props: { payload: { total: number; option_name: string } }) => {
                      const { payload } = props;
                      const total = data.bets_by_option.reduce((sum, o) => sum + o.total, 0);
                      const percent = ((payload.total / total) * 100).toFixed(1);
                      return [
                        `${payload.total} apostas (${percent}%)`,
                        payload.option_name
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de últimas apostas */}
        <Card>
            <CardContent className="p-4">
                <p className="mb-2 font-medium">Últimas Apostas</p>
                <table className="w-full text-sm">
                <thead className="text-left">
                    <tr className="border-b">
                    <th>Jogo</th>
                    <th className="text-right">Odd</th>
                    <th className="text-right">Valor</th>
                    <th className="text-right">Lucro</th>
                    <th>Status</th>
                    <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.latest_bets.map((bet, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30">
                        <td>{bet.time_casa} x {bet.time_visitante}</td>
                        <td className="text-right">{bet.odd_at_bet.toFixed(2)}</td>
                        <td className="text-right">R$ {bet.amount.toFixed(2)}</td>
                        <td className={`text-right ${bet.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {bet.lucro.toFixed(2)}
                        </td>
                        <td>{bet.status_name}</td>
                        <td>{bet.data_jogo}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
