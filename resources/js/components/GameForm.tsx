import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Game } from "@/types/game"; // Reutilize sua interface global

interface GameFormProps {
  initialData?: Game;
  onSubmit: (game: Game) => void;
  isEditing?: boolean;
}

export default function GameForm({ initialData, onSubmit, isEditing = false }: GameFormProps) {
  const [form, setForm] = useState<Game>({
    home_team: "",
    away_team: "",
    home_odds: 0,
    draw_odds: 0,
    away_odds: 0,
    match_date: "",
    ...(initialData ?? {}),
  });

  // Ajusta formato da data para input datetime-local se vier do servidor (ISO 8601)
  useEffect(() => {
    if (initialData?.match_date) {
      const date = new Date(initialData.match_date);
      const formatted = date.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
      setForm((prev) => ({ ...prev, match_date: formatted }));
    }
  }, [initialData]);

  const handleChange = (field: keyof Game, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="home_team">Time da Casa</Label>
            <Input
              id="home_team"
              type="text"
              value={form.home_team}
              onChange={(e) => handleChange("home_team", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="away_team">Time de Fora</Label>
            <Input
              id="away_team"
              type="text"
              value={form.away_team}
              onChange={(e) => handleChange("away_team", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="home_odds">Odds Casa</Label>
            <Input
              id="home_odds"
              type="number"
              step="0.01"
              value={form.home_odds}
              onChange={(e) => handleChange("home_odds", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="draw_odds">Odds Empate</Label>
            <Input
              id="draw_odds"
              type="number"
              step="0.01"
              value={form.draw_odds}
              onChange={(e) => handleChange("draw_odds", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="away_odds">Odds Fora</Label>
            <Input
              id="away_odds"
              type="number"
              step="0.01"
              value={form.away_odds}
              onChange={(e) => handleChange("away_odds", parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="match_date">Data do Jogo</Label>
            <Input
              id="match_date"
              type="datetime-local"
              value={form.match_date}
              onChange={(e) => handleChange("match_date", e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <Button type="submit">
              {isEditing ? "Atualizar Jogo" : "Criar Jogo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
