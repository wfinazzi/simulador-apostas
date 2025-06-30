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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Game {
  id: number;
  home_team: string;
  away_team: string;
  home_odds: number;
  draw_odds: number;
  away_odds: number;
  match_date: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Lista de Jogos', href: '/games/list' },
];

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [amount, setAmount] = useState("");
  const [betOption, setBetOption] = useState<"home" | "draw" | "away">("home");

  const fetchGames = () => {
    setLoading(true);
    axios.get("/api/games")
      .then((res) => setGames(res.data))
      .catch(() => toast.error("Erro ao buscar jogos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este jogo?")) return;
    try {
      await axios.delete(`/api/games/${id}`);
      toast.success("Jogo excluído com sucesso");
      fetchGames();
    } catch {
      toast.error("Erro ao excluir jogo");
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedGame) return;

    try {
        await axios.post("/api/bets", {
            game_id: selectedGame.id,
            bet_option: betOption,
            amount: parseFloat(amount),
        });

        toast.success("Aposta realizada com sucesso!");
        router.visit('/bets/history'); // redireciona para histórico
        } catch (error) {
            toast.error("Erro ao fazer aposta");
        }
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Jogos" />
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold mb-4">Jogos Cadastrados</h2>

        {loading ? (
          <p className="text-center">Carregando jogos...</p>
        ) : games.length === 0 ? (
          <p>Nenhum jogo cadastrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time da Casa</TableHead>
                <TableHead>Time de Fora</TableHead>
                <TableHead>Odds (Casa)</TableHead>
                <TableHead>Odds (Empate)</TableHead>
                <TableHead>Odds (Fora)</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.home_team}</TableCell>
                  <TableCell>{game.away_team}</TableCell>
                  <TableCell>{game.home_odds}</TableCell>
                  <TableCell>{game.draw_odds}</TableCell>
                  <TableCell>{game.away_odds}</TableCell>
                  <TableCell>{new Date(game.match_date).toLocaleString()}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.visit(`/games/${game.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(game.id)}
                    >
                      Deletar
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedGame(game)}
                        >
                          Apostar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Apostar em {game.home_team} vs {game.away_team}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Button
                              variant={betOption === "home" ? "default" : "outline"}
                              onClick={() => setBetOption("home")}
                            >
                              Casa
                            </Button>
                            <Button
                              variant={betOption === "draw" ? "default" : "outline"}
                              onClick={() => setBetOption("draw")}
                            >
                              Empate
                            </Button>
                            <Button
                              variant={betOption === "away" ? "default" : "outline"}
                              onClick={() => setBetOption("away")}
                            >
                              Fora
                            </Button>
                          </div>
                          <Input
                            type="number"
                            placeholder="Valor da aposta"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <Button className="w-full" onClick={handlePlaceBet}>
                            Confirmar Aposta
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
