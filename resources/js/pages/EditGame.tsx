import GameForm from "@/components/GameForm";
import axios from "axios";
import { toast } from "sonner";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/inertia';
import { Inertia } from '@inertiajs/inertia';
import type { Game } from '@/types/game';

interface EditGamePageProps extends PageProps {
  game: Game;
}

export default function EditGame() {
  const { props } = usePage<EditGamePageProps>();
  const game = props.game;

  const handleUpdate = async (data: any) => {
    try {
      await axios.put(`/api/games/${game.id}`, data);
      toast.success("Jogo atualizado com sucesso");

      // Aguarde um momento antes de redirecionar (opcional)
      setTimeout(() => {
        Inertia.visit('/games/list'); // ou outro destino
      }, 1000);
    } catch {
      toast.error("Erro ao atualizar jogo");
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Editar Jogo', href: `/games/${game.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Jogo ${game.home_team} vs ${game.away_team}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <h2 className="text-2xl font-bold">Editar Jogo</h2>
          <GameForm
            initialData={game}
            onSubmit={handleUpdate}
            isEditing
          />
        </div>
      </div>
    </AppLayout>
  );
}
