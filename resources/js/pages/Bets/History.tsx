import { useEffect, useState } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Bet {
  id: number;
  game: {
    home_team: string;
    away_team: string;
  };
  bet_option: string;
  amount: number;
  status: string;
  return_amount: number;
}

export default function BetHistory() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/bets")
      .then(res => setBets(res.data))
      .catch(() => alert("Erro ao carregar apostas"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "won":
        return {
          label: "Ganha",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
          className: "bg-green-100 text-green-800",
        };
      case "lost":
        return {
          label: "Perdida",
          icon: <XCircle className="w-4 h-4 mr-1" />,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: "Pendente",
          icon: <Clock className="w-4 h-4 mr-1" />,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Histórico de Apostas", href: "/bets/history" }]}>
      <Head title="Histórico de Apostas" />
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold mb-4">Histórico de Apostas</h2>

        {loading ? (
          <p>Carregando apostas...</p>
        ) : bets.length === 0 ? (
          <p>Nenhuma aposta registrada.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jogo</TableHead>
                <TableHead>Opção</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retorno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bets.map((bet) => {
                const statusInfo = getStatusInfo(bet.status);
                return (
                  <TableRow key={bet.id}>
                    <TableCell>
                      {bet.game?.home_team} x {bet.game?.away_team}
                    </TableCell>
                    <TableCell>{bet.bet_option}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(bet.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex items-center ${statusInfo.className}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(bet.return_amount))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  );
}
