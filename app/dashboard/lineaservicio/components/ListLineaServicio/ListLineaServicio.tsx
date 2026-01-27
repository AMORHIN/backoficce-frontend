"use client"

import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { getColumns, LineaServicio } from './columns';
import axios from 'axios';
import { BASE_URL_API, API_KEY } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FormEditLineaServicio } from '../FormEditLineaServicio/FormEditLineaServicio';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export function ListLineaServicio() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [lineaServicio, setLineaServicio] = useState<LineaServicio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLineaServicio, setSelectedLineaServicio] = useState<LineaServicio | null>(null);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalActivate, setOpenModalActivate] = useState(false);
    const [selectedEstado, setSelectedEstado] = useState<string>("Activo");
    const [isActivating, setIsActivating] = useState(false);
    const { toast } = useToast();

    // Solo admin (1) y operador (2) pueden acceder
    // Acceso total admin (rolId=1), operador (rolId=2) solo aquí
    const isNotAllowed = user && user.rolId !== 1 && user.rolId !== 2;

    const fetchData = async () => {
        if (isNotAllowed) return;
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL_API}/LineaServicio/GetAllLineaServicio`, {
                headers: {
                    'accept': 'text/plain',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.data.success) {
                setLineaServicio(response.data.data || []);
            }
        } catch (error) {
            console.error('Error al obtener líneas de servicio:', error);
            setLineaServicio([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isNotAllowed) return;
        fetchData();
    }, [isNotAllowed]);

    const handleEdit = (lineaServicio: LineaServicio) => {
        setSelectedLineaServicio(lineaServicio);
        setOpenModalEdit(true);
    };

    const handleActivate = (lineaServicio: LineaServicio) => {
        setSelectedLineaServicio(lineaServicio);
        setSelectedEstado(lineaServicio.estadoServicio);
        setOpenModalActivate(true);
    };

    const handleConfirmActivate = async () => {
        if (!selectedLineaServicio) return;
        setIsActivating(true);
        try {
            const response = await axios.put(
                `${BASE_URL_API}/LineaServicio/ActivarLineaServicio`,
                {
                    lineaServicioId: selectedLineaServicio.lineaServicioId,
                    estadoServicio: selectedEstado,
                    updateUserId: user?.id // ID real del usuario autenticado
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            if (response.data) {
                toast({
                    title: "✓ Éxito",
                    description: "Estado actualizado correctamente",
                });
                setOpenModalActivate(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error al activar:', error);
            toast({
                title: "✗ Error",
                description: "No se pudo actualizar el estado",
                variant: "destructive",
            });
        } finally {
            setIsActivating(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModalEdit(false);
        setSelectedLineaServicio(null);
        fetchData(); // Recargar datos después de editar
    };

    const columns = getColumns(handleEdit, handleActivate, lineaServicio);

    if (isNotAllowed) {
        return (
            <div className="flex items-center justify-center h-96 text-lg text-red-500">
                Acceso denegado. Solo administradores u operadores pueden acceder a este módulo.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <>
            <DataTable columns={columns} data={lineaServicio} />
            {/* Modal de Edición */}
            <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
                <DialogContent className="sm:max-w-156.25">
                    <DialogHeader>
                        <DialogTitle>Editar Línea de Servicio</DialogTitle>
                    </DialogHeader>
                    {selectedLineaServicio && (
                        <FormEditLineaServicio 
                            setOpenModalEdit={setOpenModalEdit}
                            lineaServicio={selectedLineaServicio}
                            onSuccess={handleCloseModal}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {/* Modal de Activar/Cambiar Estado */}
            <Dialog open={openModalActivate} onOpenChange={setOpenModalActivate}>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Cambiar Estado de Línea de Servicio</DialogTitle>
                        <DialogDescription>
                            {selectedLineaServicio && (
                                <>Cambiar el estado de <strong>{selectedLineaServicio.nombre}</strong></>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="estado" className="text-sm font-medium">
                                Nuevo Estado
                            </label>
                            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVO">ACTIVO</SelectItem>
                                    <SelectItem value="DESACTIVO">DESACTIVO</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpenModalActivate(false)}
                            disabled={isActivating}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleConfirmActivate}
                            disabled={isActivating}
                        >
                            {isActivating ? (
                                <>
                                    <span className="mr-2">Confirmando...</span>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                </>
                            ) : (
                                "Confirmar"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
