import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, Head } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Aposta {
  id: number;
  time_casa: string;
  time_visitante: string;
  tipo_aposta_nome: string;
  stake: number;
  odd_entrada: number;
  resultado: string;
  valor_lucro_prejuizo: number;
  data_jogo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Lista de Apostas', href: '/bets/list' },
];

export default function BetsList() {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApostas = () => {
    setLoading(true);
    axios.get("/api/bets")
      .then((res) => setApostas(res.data))
      .catch(() => toast.error("Erro ao buscar apostas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApostas();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta aposta?")) return;
    try {
      await axios.delete(`/api/bets/${id}`);
      toast.success("Aposta excluída com sucesso");
      fetchApostas();
    } catch {
      toast.error("Erro ao excluir aposta");
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Apostas" />
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold mb-4">Apostas Realizadas</h2>

        {loading ? (
          <p className="text-center">Carregando apostas...</p>
        ) : apostas.length === 0 ? (
          <p>Nenhuma aposta registrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Casa</TableHead>
                <TableHead>Time Visitante</TableHead>
                <TableHead>Tipo de Aposta</TableHead>
                <TableHead>Stake</TableHead>
                <TableHead>Odd Entrada</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Lucro/Prejuízo</TableHead>
                <TableHead>Data do Jogo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apostas.map((aposta) => (
                <TableRow key={aposta.id}>
                  <TableCell>{aposta.time_casa}</TableCell>
                  <TableCell>{aposta.time_visitante}</TableCell>
                  <TableCell>{aposta.tipo_aposta_nome}</TableCell>
                  <TableCell>R$ {Number(aposta.stake).toFixed(2)}</TableCell>
                  <TableCell>{Number(aposta.odd_entrada).toFixed(2)}</TableCell>
                  <TableCell>{aposta.resultado}</TableCell>
                  <TableCell
                    className={
                        Number(aposta.valor_lucro_prejuizo) >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    R$ {Number(aposta.valor_lucro_prejuizo).toFixed(2)}
                  </TableCell>
                  <TableCell>{new Date(aposta.data_jogo).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.visit(`/bets/${aposta.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(aposta.id)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  );
}
