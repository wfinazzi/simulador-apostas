import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";

interface TipoAposta {
  nome: string;
  total: number;
}

interface Stats {
  total_apostado: number;
  total_lucro: number;
  total_prejuizo: number;
  saldo_geral: number;
  por_tipo?: TipoAposta[];
}

export default function History() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/apostas/estatisticas")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Erro ao carregar estatísticas"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <Head title="Histórico de Apostas" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Resumo Geral</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">Total Apostado</p>
              <p className="text-xl font-semibold">R$ {stats.total_apostado.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-xl">
              <p className="text-sm text-gray-500">Total Lucro</p>
              <p className="text-xl font-semibold text-green-700">R$ {stats.total_lucro.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-red-100 rounded-xl">
              <p className="text-sm text-gray-500">Total Prejuízo</p>
              <p className="text-xl font-semibold text-red-700">R$ {stats.total_prejuizo.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl">
              <p className="text-sm text-gray-500">Saldo Final</p>
              <p className="text-xl font-semibold">R$ {stats.saldo_geral.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <p>Nenhuma estatística disponível.</p>
        )}

        {stats?.por_tipo && (
          <>
            <h3 className="text-lg font-bold mt-8 mb-2">Apostas por Tipo</h3>
            <ul className="list-disc ml-5 text-sm">
              {stats.por_tipo.map(tipo => (
                <li key={tipo.nome}>
                  {tipo.nome}: {tipo.total} apostas
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AppLayout>
  );
}
