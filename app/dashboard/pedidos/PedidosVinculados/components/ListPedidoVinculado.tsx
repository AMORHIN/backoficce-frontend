"use client";

import { useEffect, useState, useCallback } from 'react';
import { DataTable } from './ListPedidoVinculado/data-table';
import { getColumns } from './ListPedidoVinculado/columns';
import { pedidoVinculado } from './ListPedidoVinculado/ListPedidoVinculado.types';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export function ListPedidoVinculado() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const defaultInicio = `${todayStr}T00:00:00`;
  const defaultFin = `${todayStr}T${hh}:${min}:${ss}`;

  const [pedidosVinculados, setPedidosVinculados] = useState<pedidoVinculado[]>([]);
  const [rawApi, setRawApi] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState(defaultInicio);
  const [fechaFin, setFechaFin] = useState(defaultFin);

  const fetchPedidosVinculados = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        '/ChutePedido/GetAllPedidoVinculados',
        {
          params: {
            FechaInicio: fechaInicio.replace('T', ' '),
            FechaFin: fechaFin.replace('T', ' '),
          },
        }
      );
      setRawApi(res.data);
      if (res.data && Array.isArray(res.data.data)) {
        setPedidosVinculados([...res.data.data]);
      } else {
        setPedidosVinculados([]);
      }
    } catch (err) {
      setRawApi({ error: err });
      setPedidosVinculados([]);
    } finally {
      setIsLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchPedidosVinculados();
  }, [fetchPedidosVinculados]);

  if (user && user.rolId !== 1 && user.rolId !== 2) {
    if (typeof window !== 'undefined') router.replace('/dashboard');
    return (
      <div className="flex items-center justify-center h-96 text-lg text-black-500">
        Acceso denegado. Solo administradores u operadores pueden acceder a este módulo.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Pedidos vinculados</h2>
      <div className="p-4 bg-background shadow-md rounded-lg mb-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-end">
          {/* Fecha Inicio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Fecha y Hora Inicio</label>
            <Input
              type="datetime-local"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </div>
          {/* Fecha Fin */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Fecha y Hora Fin</label>
            <Input
              type="datetime-local"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </div>
          {/* Botón */}
          <div className="flex md:items-end">
            <Button
              disabled={isLoading}
              className="h-10 px-6 flex items-center gap-2"
              onClick={fetchPedidosVinculados}
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? 'Buscando' : 'Buscar'}
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={getColumns()}
        data={pedidosVinculados}
      />
    </div>
  );
}
