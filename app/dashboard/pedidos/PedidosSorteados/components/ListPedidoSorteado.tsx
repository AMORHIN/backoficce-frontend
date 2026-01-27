"use client";

import { useEffect, useState, useCallback } from 'react';
import { DataTable } from './ListPedidoSorteado/data-table';
import { getColumns } from './ListPedidoSorteado/columns';
import { pedidoSorteado } from './ListPedidoSorteado/ListPedidoSorteado.types';
import axios from '@/lib/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';



export function ListPedidoSorteado() {

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

  const [pedidosSorteados, setPedidosSorteados] = useState<pedidoSorteado[]>([]);
  const [rawApi, setRawApi] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPedidoSorteado, setSelectedPedidoSorteado] = useState<pedidoSorteado | null>(null);
  const [openModalBody, setOpenModalBody] = useState(false);
  const [jsonBody, setJsonBody] = useState<string | null>(null);
  const [jsonProviderOrder, setJsonProviderOrder] = useState<string | null>(null);
  const [pedidoBodyActual, setPedidoBodyActual] = useState<pedidoSorteado | null>(null);
  const [fechaInicio, setFechaInicio] = useState(defaultInicio);
  const [fechaFin, setFechaFin] = useState(defaultFin);
  const [openReprocesar, setOpenReprocesar] = useState(false);
  const [pedidoSorteados, setPedidoSorteados] = useState<string | null>(null);
  const [isReprocesando, setIsReprocesando] = useState(false);

  const fetchPedidosSorteados = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        '/ChutePedido/GetAllPedidoSorteados',
        {
          params: {
            FechaInicio: fechaInicio.replace('T', ' '),
            FechaFin: fechaFin.replace('T', ' '),
          },
        }
      );
      setRawApi(res.data);
      if (res.data && Array.isArray(res.data.data)) {
        setPedidosSorteados([...res.data.data]);
      } else {
        setPedidosSorteados([]);
      }
    } catch (err) {
      setRawApi({ error: err });
      setPedidosSorteados([]);
    } finally {
      setIsLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchPedidosSorteados();
  }, [fetchPedidosSorteados]);

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
      <h2 className="text-lg font-semibold mb-2">Pedidos sorteados</h2>
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
                    onClick={fetchPedidosSorteados}
                  >
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {isLoading ? 'Buscando' : 'Buscar'}
                  </Button>
                </div>
                 </div>
                </div>
      
            <DataTable
              columns={getColumns(
                (json, providerOrder) => {
                  const pedido = pedidosSorteados.find(p => p.providerOrderIdentifier === providerOrder);
                  setJsonBody(json);
                  setJsonProviderOrder(providerOrder);
                  setPedidoBodyActual(pedido ?? null);
                  setOpenModalBody(true);
                },
                (chutePedidoId) => { setPedidoSorteados(chutePedidoId); setOpenReprocesar(true); },
              )}
              data={pedidosSorteados}
            />
    </div>
  )
}
