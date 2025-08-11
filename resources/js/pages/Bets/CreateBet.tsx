import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { NumericFormat } from "react-number-format";

interface Banca {
  id: number;
  nome: string;
  valor_inicial: string;
}

interface TipoAposta {
  id: number;
  nome: string;
}

interface Status {
  id: number;
  nome: string;
}

export default function CreateBet() {
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [tiposApostas, setTiposApostas] = useState<TipoAposta[]>([]);

  const [form, setForm] = useState({
    banca_id: "",
    bet_option: "",
    data_jogo: "",
    time_casa: "",
    time_visitante: "",
    odd_at_bet: "",
    amount: "",
    relacao_com_banca: "",
    status_id: "",
    return_amount: "",
    comentario: "",
  });

  useEffect(() => {
    axios.get<Banca[]>("/api/bancas")
      .then(res => setBancas(res.data))
      .catch(() => toast.error("Erro ao carregar bancas"));

    axios.get<TipoAposta[]>("/api/tipos_apostas")
      .then(res => setTiposApostas(res.data))
      .catch(() => toast.error("Erro ao carregar tipos de aposta"));
  }, []);

  const [status, setStatus] = useState<Status[]>([]);

  useEffect(() => {
    axios.get<Status[]>("/api/apostas/status")
      .then(res => setStatus(res.data))
      .catch(() => toast.error("Erro ao carregar status"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStakeChange = (values: { floatValue?: number }) => {
    const amountValue = values.floatValue || 0;
    setForm(prev => {
      const banca = bancas.find(b => String(b.id) === prev.banca_id);
      const bancaValor = banca ? parseFloat(banca.valor_inicial) : 0;
      const relacao = bancaValor > 0 ? ((amountValue / bancaValor) * 100).toFixed(2) : "";
      return { ...prev, amount: amountValue, relacao_com_banca: relacao };
    });
  };

  const handleOddChange = (values: { value: string }) => {
    setForm(prev => ({ ...prev, odd_at_bet: values.value }));
  };

  const handleReturnChange = (values: { value: string }) => {
    setForm(prev => ({ ...prev, return_amount: values.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/bets", form);
      toast.success("Aposta cadastrada com sucesso!");
      router.visit("/bets/list");
    } catch {
      toast.error("Erro ao cadastrar aposta");
    }
  };

  return (
    <AppLayout>
      <Head title="Nova Aposta" />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Nova Aposta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label htmlFor="banca_id">Banca</Label>
            <Select
              value={form.banca_id}
              onValueChange={val => setForm(prev => ({ ...prev, banca_id: val }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma banca" />
              </SelectTrigger>
              <SelectContent>
                {bancas.map(banca => (
                  <SelectItem key={banca.id} value={String(banca.id)}>
                    {banca.nome} — R$ {parseFloat(banca.valor_inicial).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        <div>
        <Label htmlFor="bet_option">Tipo de Aposta</Label>
        <Select
            name="bet_option"
            value={form.bet_option}
            onValueChange={(val) => setForm((prev) => ({ ...prev, bet_option: val }))}
            required
        >
            <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção">
                {tiposApostas.find((t) => String(t.id) === String(form.bet_option))?.nome}
            </SelectValue>
            </SelectTrigger>
            <SelectContent>
            {tiposApostas.map((tipo) => (
                <SelectItem key={tipo.id} value={String(tipo.id)}>
                {tipo.nome}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>

          <div>
            <Label htmlFor="data_jogo">Data do Jogo</Label>
            <Input
              type="datetime-local"
              name="data_jogo"
              value={form.data_jogo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time_casa">Time da Casa</Label>
              <Input
                name="time_casa"
                value={form.time_casa}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="time_visitante">Time Visitante</Label>
              <Input
                name="time_visitante"
                value={form.time_visitante}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="odd_at_bet">Odd de Entrada</Label>
            <NumericFormat
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              name="odd_at_bet"
              value={form.odd_at_bet}
              onValueChange={handleOddChange}
              customInput={Input}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Stake</Label>
              <NumericFormat
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                name="amount"
                value={form.amount}
                onValueChange={handleStakeChange}
                customInput={Input}
                required
              />
            </div>
            <div>
              <Label htmlFor="relacao_com_banca">Relação com a Banca (%)</Label>
              <Input
                name="relacao_com_banca"
                value={form.relacao_com_banca}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status_id">Resultado</Label>
            <Select
              value={form.status_id}
              onValueChange={val => setForm(prev => ({ ...prev, status_id: val }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um resultado" />
              </SelectTrigger>
              <SelectContent>
                {status.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="return_amount">Valor do Lucro/Prejuízo</Label>
            <NumericFormat
              decimalScale={2}
              fixedDecimalScale
              allowNegative={true}
              name="return_amount"
              value={form.return_amount}
              onValueChange={handleReturnChange}
              customInput={Input}
            />
          </div>

          <div>
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
            />
          </div>

          <div className="text-right">
            <Button type="submit">Salvar Aposta</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
