"use client"

import { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from './ListPedido/data-table';
import { getColumns } from './ListPedido/columns';
import { Pedido } from './ListPedido/ListPedido.types';
import axios from '@/lib/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';


export function ListPedido() {
	// Exportar pedidos a Excel
	const exportToExcel = () => {
		if (!pedidos.length) return;
		// Eliminar campos no deseados si es necesario
		const dataToExport = pedidos.map(({ body, ...rest }) => rest);
		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
		XLSX.writeFile(workbook, 'pedidos_no_procesados.xlsx');
	};

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Obtener fecha actual y formatear para los inputs tipo datetime-local
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
  
	const [pedidos, setPedidos] = useState<Pedido[]>([]);
	const [rawApi, setRawApi] = useState<unknown>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
	const [openModalBody, setOpenModalBody] = useState(false);
	const [jsonBody, setJsonBody] = useState<string | null>(null);
	const [jsonProviderOrder, setJsonProviderOrder] = useState<string | null>(null);
	const [pedidoBodyActual, setPedidoBodyActual] = useState<Pedido | null>(null);
	const [fechaInicio, setFechaInicio] = useState(defaultInicio);
	const [fechaFin, setFechaFin] = useState(defaultFin);
	const [openReprocesar, setOpenReprocesar] = useState(false);
	const [pedidoAReprocesar, setPedidoAReprocesar] = useState<string | null>(null);
	const [isReprocesando, setIsReprocesando] = useState(false);

  // Lógica de recarga igual que en línea de servicio
  const fetchPedidos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        '/ChutePedido/GetAllPedidoNoProcesados',
        {
          params: {
            FechaInicio: fechaInicio.replace('T', ' '),
            FechaFin: fechaFin.replace('T', ' '),
          },
        }
      );
      setRawApi(res.data);
      if (res.data && Array.isArray(res.data.data)) {
        setPedidos([...res.data.data]);
      } else {
        setPedidos([]);
      }
    } catch (err) {
      setRawApi({ error: err });
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  }, [fechaInicio, fechaFin]);


  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Acceso total admin (rolId=1), operador (rolId=2) solo aquí
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
			<h2 className="text-lg font-semibold mb-2">Pedidos no procesados</h2>
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
				{/* Botones */}
				<div className="flex md:items-end gap-2">
					<Button
						disabled={isLoading}
						className="h-10 px-6 flex items-center gap-2"
						onClick={fetchPedidos}
					>
						{isLoading && <Loader2 className="animate-spin" size={18} />}
						{isLoading ? 'Buscando' : 'Buscar'}
					</Button>
					<Button
						variant="outline"
						className="h-10 px-6 flex items-center gap-2"
						onClick={exportToExcel}
						disabled={pedidos.length === 0}
					>
						Exportar a Excel
					</Button>
				</div>
				</div>
			</div>

			<DataTable
				columns={getColumns(
					(json, providerOrder) => {
						const pedido = pedidos.find(p => p.providerOrderIdentifier === providerOrder);
						setJsonBody(json);
						setJsonProviderOrder(providerOrder);
						setPedidoBodyActual(pedido ?? null);
						setOpenModalBody(true);
					},
					(providerOrderId) => { setPedidoAReprocesar(providerOrderId); setOpenReprocesar(true); },
				)}
				data={pedidos}
			/>
			<Dialog open={openModalBody} onOpenChange={setOpenModalBody}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="truncate max-w-full" title={jsonProviderOrder ?? ''}>
							{jsonProviderOrder}
						</DialogTitle>
						<DialogDescription>
							Estructura completa del pedido
						</DialogDescription>
						<pre className="bg-muted p-2 rounded text-xs overflow-x-auto max-h-96 mt-2 text-left">
							{jsonBody && JSON.stringify(JSON.parse(jsonBody), null, 2)}
						</pre>
					</DialogHeader>
					<div className="flex justify-center gap-4 mt-4">
						<Button variant="outline" onClick={() => setOpenModalBody(false)} disabled={isReprocesando}>Cancelar</Button>
						<Button
							disabled={isReprocesando || !pedidoBodyActual}
							onClick={async () => {
							if (!pedidoBodyActual) return;
							setIsReprocesando(true);
							try {
								const pedido = pedidoBodyActual;
								const bodyJson = JSON.parse(pedido.body);
								const data = bodyJson.data || {};
								const body = {
									id: pedido.id,
									clientCode: data.clientCode ?? '',
									clientServiceCode: data.clientServiceCode ?? null,
									providerOrderIdentifier: data.providerOrderIdentifier ?? pedido.providerOrderIdentifier ?? '',
									trackingNumber: data.trackingNumber ?? '',
									eventDate: data.eventDate ?? pedido.createDate ?? '',
									userId: 1
								};
								const response = await axios.put(
									'/ChutePedido/UpdateChutePedido',
									body
								);
								const resData = response.data;
								const backendMessage = resData?.data?.message || resData?.message || '';
								if (resData.status === 200) {
									toast({ title: 'Pedido reprocesado', description: backendMessage || `El pedido ${pedido.providerOrderIdentifier} fue reprocesado correctamente.`, variant: 'default' });
									fetchPedidos(); // Recargar tras éxito
								} else {
									toast({ title: 'Error al reprocesar', description: backendMessage || 'Error desconocido', variant: 'destructive' });
								}
							} catch (err) {
								  toast({ title: 'Error al reprocesar', description: (err instanceof Error ? err.message : 'Error desconocido'), variant: 'destructive' });
							} finally {
								setIsReprocesando(false);
								setOpenModalBody(false);
							}
						}}
						>
							{isReprocesando ? <Loader2 className="animate-spin inline-block mr-2" size={16} /> : null}
							Reprocesar
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Modal de Reprocesar */}
			<Dialog open={openReprocesar} onOpenChange={setOpenReprocesar}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>ReProcesar Pedido</DialogTitle>
					</DialogHeader>
					<div className="py-2 text-center">
						¿Deseas reprocesar el pedido <span className="font-mono text-xs">{pedidoAReprocesar}</span>?
					</div>
					<div className="flex justify-center gap-4 mt-4">
						<Button variant="outline" onClick={() => setOpenReprocesar(false)} disabled={isReprocesando}>Cancelar</Button>
						<Button
							disabled={isReprocesando}
							onClick={async () => {
							if (!pedidoAReprocesar) return;
							setIsReprocesando(true);
							try {
								const pedido = pedidos.find(p => p.providerOrderIdentifier === pedidoAReprocesar);
								if (!pedido) throw new Error('Pedido no encontrado');
								const bodyJson = JSON.parse(pedido.body);
								const data = bodyJson.data || {};
								const body = {
									id: pedido.id,
									clientCode: data.clientCode ?? '',
									clientServiceCode: data.clientServiceCode ?? null,
									providerOrderIdentifier: data.providerOrderIdentifier ?? pedido.providerOrderIdentifier ?? '',
									trackingNumber: data.trackingNumber ?? '',
									eventDate: data.eventDate ?? pedido.createDate ?? '',
									userId: 1
								};
								const response = await axios.put(
									'/ChutePedido/UpdateChutePedido',
									body
								);
								const resData = response.data;
								const backendMessage = resData?.data?.message || resData?.message || '';
								if (resData.status === 200) {
									toast({ title: 'Pedido reprocesado', description: backendMessage || `El pedido ${pedidoAReprocesar} fue reprocesado correctamente.`, variant: 'default' });
									fetchPedidos(); // Recargar tras éxito
								} else {
									toast({ title: 'Error al reprocesar', description: backendMessage || 'Error desconocido', variant: 'destructive' });
								}
							} catch (err) {
								toast({ title: 'Error al reprocesar', description: (err instanceof Error ? err.message : 'Error desconocido'), variant: 'destructive' });
							} finally {
								setIsReprocesando(false);
								setOpenReprocesar(false);
							}
						}}
						>
							{isReprocesando ? <Loader2 className="animate-spin inline-block mr-2" size={16} /> : null}
							Reprocesar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

