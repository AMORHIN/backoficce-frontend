"use client"

import React, { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { DataTable } from './data-table';
import { getColumns } from './columns';
import { cubicadoraList } from './ListCubicadora.types';
import axios from 'axios';
import { BASE_URL_API, API_KEY } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export function ListCubicadora(){
    // Exportar pedidos a Excel
        const exportToExcel = () => {
            if (!cubicadoras.length) return;
            const worksheet = XLSX.utils.json_to_sheet(cubicadoras);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Peso_volumen');
            XLSX.writeFile(workbook, 'PesosVolumenes.xlsx');
        };

    const { user, token } = useAuth();
    const router = useRouter();
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

    const [cubicadoras, setCubicadoras] = useState<cubicadoraList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    
    const [fechaInicio, setFechaInicio] = useState(defaultInicio);
	const [fechaFin, setFechaFin] = useState(defaultFin);


    const fetchPesosVolumenes = useCallback(async () => {     
        try {
            setIsLoading(true);
            let formattedInicio = fechaInicio.replace('T', ' ');
            if (formattedInicio.length === 16) { // YYYY-MM-DD HH:MM
                formattedInicio += ':00';
            }
            let formattedFin = fechaFin.replace('T', ' ');
            if (formattedFin.length === 16) { // YYYY-MM-DD HH:MM
                formattedFin += ':00';
            }

            const response = await axios.get(`${BASE_URL_API}/Cubicadora/GetCubicadora`, 
                {
                params: {
                    FechaInicio: formattedInicio,
                    FechaFin: formattedFin,
                },
                headers: {
                    'accept': 'text/plain',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.data.success) {
                setCubicadoras(response.data.data || []);
            }
        } catch (error) {
            console.error('Error al obtener la data:', error);
            setCubicadoras([]);
        } finally {
            setIsLoading(false);
        }
    }, [fechaInicio, fechaFin, token]);

    useEffect(() => {
        fetchPesosVolumenes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <div className="p-4 bg-background shadow-md rounded-lg mb-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-end">
                {/* Fecha Inicio */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium">Fecha y Hora Inicio</label>
                    <Input type="datetime-local"value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </div>

                {/* Fecha Fin */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium">Fecha y Hora Fin</label>
                    <Input type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </div>
                
                {/* Botones */}
                <div className="flex items-end gap-2">
                    <Button disabled={isLoading} className="h-10 px-6 flex items-center gap-2" onClick={fetchPesosVolumenes} >
                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                        {isLoading ? 'Buscando' : 'Buscar'}
                    </Button>

                    <Button variant="outline" className="h-10 px-6 flex items-center gap-2" onClick={exportToExcel} disabled={cubicadoras.length === 0}>
                        Exportar a Excel
                    </Button>
                </div>
            </div>
        </div>
        <DataTable 
            columns={getColumns()}
            data={cubicadoras}
         />

        {/* Modal de Edición */}
        <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
            <DialogContent className="sm:max-w-156.25">
                <DialogHeader>
                    <DialogTitle>Editar Cubicadora</DialogTitle>
                </DialogHeader>
                    {/* {selectedCubicadora && (
                        <FormEditCubicadora 
                        setOpenModalEdit={setOpenModalEdit}
                        cubicadora={selectedCubicadora}
                        onSuccess={handleCloseModal}
                        />
                    )} */}
            </DialogContent>
        </Dialog>
    </div>
  )
}