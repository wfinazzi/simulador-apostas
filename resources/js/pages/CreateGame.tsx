import GameForm from "@/components/GameForm";
import axios from "axios";
import { toast } from "sonner";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function CreateGame() {
  const handleCreate = async (data: any) => {
    try {
      await axios.post("/api/games", data);
      toast.success("Jogo criado com sucesso");
    } catch {
      toast.error("Erro ao criar jogo");
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Dashboard',
          href: '/dashboard',
      },
      {
        title: 'Criar Jogo',
        href: '/bets/create',
    },
  ];

  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-3xl mx-auto px-4 mt-6">
                    <h2 className="text-2xl font-bold">Criar Novo Jogo</h2>
                    <GameForm onSubmit={handleCreate} />
                </div>
            </div>
        </AppLayout>
  );
}

