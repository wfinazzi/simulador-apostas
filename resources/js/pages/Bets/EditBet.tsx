import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { NumericFormat } from "react-number-format";

export default function EditBet() {
  const pathParts = window.location.pathname.split("/");
  const id = pathParts[pathParts.indexOf("bets") + 1];

  const [bancas, setBancas] = useState([]);
  const [tiposApostas, setTiposApostas] = useState([]);
  const [status, setStatus] = useState([]);
  const [form, setForm] = useState({
    banca_id: "",
    user_id: "",
    game_id: "",
    bet_option: "home",
    amount: "",
    odd_at_bet: "",
    status_id: "",
    return_amount: "",
    tipo_aposta_id: "",
    data_jogo: "",
    time_casa: "",
    time_visitante: "",
    stake: "",
    relacao_com_banca: "",
    resultado: "lucro",
    valor_lucro_prejuizo: "",
    comentario: "",
  });

  console.log(status);

  useEffect(() => {
    axios.get("/api/bancas").then((res) => setBancas(res.data));
    axios.get("/api/tipos_apostas").then((res) => setTiposApostas(res.data));

    axios.get("/api/apostas/status").then((res) => setStatus(res.data));
    axios
      .get(`/api/bets/${id}`)
      .then((res) => {
        setForm((prev) => ({
          ...prev,
          ...res.data,
          status_id: String(res.data.status?.id || res.data.status_id || ""),
        }));
      })
      .catch(() => toast.error("Erro ao carregar dados da aposta"));
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (values) => {
    const amount = values.floatValue || 0;
    setForm((prev) => {
      const banca = bancas.find((b) => String(b.id) === prev.banca_id);
      const bancaValor = banca ? parseFloat(banca.valor_inicial) : 0;
      const relacao = bancaValor > 0 ? ((amount / bancaValor) * 100).toFixed(2) : "";
      return { ...prev, amount, stake: amount, relacao_com_banca: relacao };
    });
  };

  const handleOddChange = (values) => {
    setForm((prev) => ({ ...prev, odd_at_bet: values.value }));
  };

  const handleReturnAmountChange = (values) => {
    setForm((prev) => ({ ...prev, return_amount: values.value, valor_lucro_prejuizo: values.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/bets/${id}`, form);
      toast.success("Aposta atualizada com sucesso!");
      router.visit("/bets/list");
    } catch {
      toast.error("Erro ao atualizar aposta");
    }
  };

  return (
    <AppLayout>
      <Head title="Editar Aposta" />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Editar Aposta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Banca</Label>
            <Select
              value={form.banca_id}
              onValueChange={(val) => setForm((prev) => ({ ...prev, banca_id: val }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma banca" />
              </SelectTrigger>
              <SelectContent>
                {bancas.map((banca) => (
                  <SelectItem key={banca.id} value={String(banca.id)}>
                    {banca.nome} — R$ {parseFloat(banca.valor_inicial).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data do Jogo</Label>
            <Input
              type="datetime-local"
              name="data_jogo"
              value={form.data_jogo}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Time da Casa</Label>
              <Input name="time_casa" value={form.time_casa} onChange={handleChange} />
            </div>
            <div>
              <Label>Time Visitante</Label>
              <Input name="time_visitante" value={form.time_visitante} onChange={handleChange} />
            </div>
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
            <Label>Odd</Label>
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

          <div>
            <Label>Valor Apostado (Stake)</Label>
            <NumericFormat
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              name="amount"
              value={form.amount}
              onValueChange={handleAmountChange}
              customInput={Input}
              required
            />
          </div>

         <div>
            <Label>Resultado</Label>
            <Select
              value={form.status_id}
              onValueChange={(val) => setForm((prev) => ({ ...prev, status_id: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o resultado">
                  {status.find((s) => String(s.id) === form.status_id)?.nome}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {status.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Retorno (Lucro/Prejuízo)</Label>
            <NumericFormat
              decimalScale={2}
              fixedDecimalScale
              allowNegative={true}
              name="return_amount"
              value={form.return_amount}
              onValueChange={handleReturnAmountChange}
              customInput={Input}
            />
          </div>

          <div>
            <Label>Comentário</Label>
            <Textarea name="comentario" value={form.comentario} onChange={handleChange} />
          </div>

          <div className="text-right">
            <Button type="submit">Atualizar Aposta</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
