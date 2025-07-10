import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from "react";

import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

import { PieLabelRenderProps } from 'recharts';

const renderStatusLabel = (props: PieLabelRenderProps) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload
  } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const config = statusConfig[payload.status_name] ?? statusConfig['Desconhecido'];

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${config.icon} ${payload.status_name} (${payload.total} | ${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

const renderOptionLabel = (props: PieLabelRenderProps) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload
  } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${payload.option_name} (${payload.total} | ${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};

const colors = ["#22c55e", "#ef4444", "#3b82f6", "#facc15"];

const statusConfig: Record<string, { color: string; icon: string }> = {
  'Ganha':      { color: '#22c55e', icon: '🟢' },
  'Perdida':    { color: '#ef4444', icon: '🔴' },
  'Cashout':    { color: '#facc15', icon: '💰' },
  'Em aberto':  { color: '#3b82f6', icon: '⏳' },
  'Desconhecido': { color: '#9ca3af', icon: '❓' },
};

interface Bet {
  time_casa: string;
  time_visitante: string;
  amount: number;
  odd_at_bet: number;
  status_name: string;
  data_jogo: string;
  return_amount: number;
  lucro: number;
}

interface DashboardData {
  total_bets: number;
  total_amount: number;
  total_return: number;
  profit: number;
  roi: number;
  bets_by_status: {
    status_id: number;
    status_name: string;
    total: number;
  }[];
  bets_by_option: {
    bet_option: number;
    option_name: string;
    total: number;
  }[];
  profit_per_day: {
    date: string;
    profit: number;
  }[];
  latest_bets: Bet[];
}



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },

];

export default function Dashboard() {

    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        axios.get("/api/dashboard").then((res) => {
            setData(res.data);
        });
    }, []);

    if (!data) return <div className="p-4">Carregando...</div>;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
             <div className="p-6 grid gap-6">
      {/* Cards principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p>Total de Apostas</p>
            <h2 className="text-xl font-bold">{data.total_bets}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>Valor Apostado</p>
            <h2 className="text-xl font-bold">R$ {data.total_amount.toFixed(2)}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>Retorno</p>
            <h2 className="text-xl font-bold">R$ {data.total_return.toFixed(2)}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p>Lucro</p>
            <h2 className={`text-xl font-bold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {data.profit.toFixed(2)}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de linha: lucro por dia */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-2 font-medium">Lucro por dia</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.profit_per_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos de pizza */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 font-medium">Apostas por Status</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={data.bets_by_status}
                    dataKey="total"
                    nameKey="status_name"
                    outerRadius={100}
                    label={renderStatusLabel} // ← aqui está a mágica
                >
                    {data.bets_by_status.map((entry, i) => {
                        const config = statusConfig[entry.status_name] ?? statusConfig['Desconhecido'];
                        return <Cell key={i} fill={config.color} />;
                    })}
                </Pie>
                <Tooltip
                    formatter={(value: any, name: any, props: any) => {
                        const { payload } = props;
                        const total = data.bets_by_status.reduce((sum, s) => sum + s.total, 0);
                        const percent = ((payload.total / total) * 100).toFixed(1);
                        const config = statusConfig[payload.status_name] ?? statusConfig['Desconhecido'];

                        return [
                        `${payload.total} apostas (${percent}%)`,
                        `${config.icon} ${payload.status_name}`
                        ];
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="mb-2 font-medium">Apostas por Tipo</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={data.bets_by_option}
                    dataKey="total"
                    nameKey="option_name"
                    outerRadius={100}
                    label={renderOptionLabel} // ← aqui
                >
                    {data.bets_by_option.map((_, i) => (
                        <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: any, name: any, props: any) => {
                        const { payload } = props;
                        const total = data.bets_by_option.reduce((sum, o) => sum + o.total, 0);
                        const percent = ((payload.total / total) * 100).toFixed(1);
                        return [`${payload.total} apostas (${percent}%)`, payload.option_name];
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4 overflow-x-auto">
                <p className="mb-4 font-medium">Últimas Apostas</p>
                <table className="w-full text-sm">
                <thead className="text-left border-b">
                    <tr>
                    <th>Jogo</th>
                    <th className="text-right">Odd</th>
                    <th className="text-right">Valor</th>
                    <th className="text-right">Lucro</th>
                    <th>Status</th>
                    <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.latest_bets.map((bet, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30">
                        <td>{bet.time_casa} x {bet.time_visitante}</td>
                        <td className="text-right">{bet.odd_at_bet.toFixed(2)}</td>
                        <td className="text-right">R$ {bet.amount.toFixed(2)}</td>
                        <td className={`text-right ${bet.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {bet.lucro.toFixed(2)}
                        </td>
                        <td>{bet.status_name}</td>
                        <td>{bet.data_jogo}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </CardContent>
        </Card>
      </div>
    </div>
        </AppLayout>
    );
}
