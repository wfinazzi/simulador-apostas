import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBanca() {
  const [form, setForm] = useState({
    nome: "",
    valor_inicial: "",
    data_inicio: "",
    observacao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/api/bancas", form);
      toast.success("Banca cadastrada com sucesso!");
      router.visit("/bancas/list");
    } catch (err) {
      toast.error("Erro ao cadastrar banca");
    }
  };

  return (
    <AppLayout>
      <Head title="Nova Banca" />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Nova Banca</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input name="nome" value={form.nome} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="valor_inicial">Valor Inicial (R$)</Label>
            <Input type="number" step="0.01" name="valor_inicial" value={form.valor_inicial} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="data_inicio">Data de Início</Label>
            <Input type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Textarea name="observacao" value={form.observacao} onChange={handleChange} />
          </div>

          <div className="text-right">
            <Button type="submit">Salvar Banca</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
