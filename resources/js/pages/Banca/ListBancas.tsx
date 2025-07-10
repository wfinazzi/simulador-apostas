import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function ListBancas() {
  const [bancas, setBancas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBancas = () => {
    setLoading(true);
    axios
      .get("/api/bancas")
      .then((res) => setBancas(res.data))
      .catch(() => toast.error("Erro ao carregar bancas"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta banca?")) return;
    try {
      await axios.delete(`/api/bancas/${id}`);
      toast.success("Banca excluída com sucesso!");
      fetchBancas();
    } catch {
      toast.error("Erro ao excluir banca");
    }
  };

  useEffect(() => {
    fetchBancas();
  }, []);

  return (
    <AppLayout>
      <Head title="Minhas Bancas" />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Minhas Bancas</h2>
          <Button onClick={() => router.visit("/bancas/create")}>Nova Banca</Button>
        </div>
        {loading ? (
          <p>Carregando bancas...</p>
        ) : bancas.length === 0 ? (
          <p>Nenhuma banca cadastrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor Inicial</TableHead>
                <TableHead>Saldo Atual</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bancas.map((banca) => (
                <TableRow key={banca.id}>
                  <TableCell>{banca.nome}</TableCell>
                  <TableCell>R$ {parseFloat(banca.valor_inicial).toFixed(2)}</TableCell>
                  <TableCell>R$ {parseFloat(banca.saldo_atual || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    {banca.data_inicio
                      ? new Date(banca.data_inicio).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{banca.observacao || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.visit(`/bancas/${banca.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banca.id)}
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
