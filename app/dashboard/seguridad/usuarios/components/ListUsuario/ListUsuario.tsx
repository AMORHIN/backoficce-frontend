
"use client"
// Tipo para error con response de axios
type ErrorConResponse = {
    response?: {
        data?: {
            message?: string;
        };
    };
};

import { useEffect, useState } from 'react';
type Rol = {
    rolId: number;
    rol: string;
};
import { DataTable } from './data-table';
import { getColumns } from './colums';
import type { UsuarioList } from './colums.types';
import axios from 'axios';
import { BASE_URL_API } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEdithUsuario } from '@/app/dashboard/seguridad/usuarios/components/FormEditUsuario';

 import { useRouter } from 'next/navigation';

export function ListUsuario({ reloadRef }: { reloadRef?: React.MutableRefObject<() => void> }) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [lineaUsuario, setLineaUsuario] = useState<UsuarioList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLineaUsuario, setSelectedLineaUsuario] = useState<UsuarioList | null>(null);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalRol, setOpenModalRol] = useState(false);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [selectedRolId, setSelectedRolId] = useState<number | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const { toast } = useToast();
    // Seguridad: solo admin (rolId=1)
    const isNotAdmin = user && user.rolId !== 1;

    useEffect(() => {
        if (isNotAdmin) return;
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/Rol/GetAllRol`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        accept: 'text/plain',
                    },
                });
                if (response.data.success && Array.isArray(response.data.data)) {
                    setRoles(response.data.data);
                }
            } catch (error) {
                setRoles([]);
            }
        };
        fetchRoles();
    }, [token, isNotAdmin]);

    const fetchData = async () => {
        if (isNotAdmin) return;
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL_API}/User/GetAllUser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'accept': 'text/plain',
                },
            });
            if (response.data.success) {
                setLineaUsuario(response.data.data || []);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setLineaUsuario([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Permitir recarga externa
    if (reloadRef) reloadRef.current = fetchData;

    useEffect(() => {
        if (isNotAdmin) return;
        fetchData();
    }, [isNotAdmin]);

    const handleEdit = (usuario: UsuarioList) => {
        setSelectedLineaUsuario(usuario);
        setOpenModalEdit(true);
    };

    const handleCloseModal = () => {
        setOpenModalEdit(false);
        setSelectedLineaUsuario(null);
        fetchData(); // Recargar datos después de editar
    };

    const handleAssignRol = (usuario: UsuarioList) => {
        setSelectedLineaUsuario(usuario);
        setSelectedRolId(usuario.rolId);
        setOpenModalRol(true);
    };

    const handleConfirmAssignRol = async () => {
        if (!selectedLineaUsuario || !selectedRolId) return;
        setIsAssigning(true);
        try {
            await axios.post(
                `${BASE_URL_API}/User/AsignarRol`,
                {
                    usuarioId: selectedLineaUsuario.userId,
                    rolId: selectedRolId,
                    userUpdateId: user?.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        accept: 'text/plain',
                    },
                }
            );
            toast({ title: "Rol asignado correctamente" });
            setOpenModalRol(false);
            fetchData();
        } catch (error: unknown) {
            let message = "Error desconocido";
            if (
                typeof error === "object" &&
                error &&
                "response" in error &&
                (error as ErrorConResponse).response?.data?.message
            ) {
                message = (error as ErrorConResponse).response!.data!.message ?? "Error desconocido";
            } else if (error instanceof Error) {
                message = error.message;
            }
            toast({ title: "Error al asignar rol", description: message, variant: "destructive" });
        } finally {
            setIsAssigning(false);
        }
    };

    const columns = getColumns(handleEdit, handleAssignRol);

    if (isNotAdmin) {
        return (
            <div className="flex items-center justify-center h-96 text-lg text-red-500">
                Acceso denegado. Solo administradores pueden acceder a este módulo.
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
            <DataTable columns={columns} data={lineaUsuario} />
            {/* Modal para asignar rol */}
            <Dialog open={openModalRol} onOpenChange={setOpenModalRol}>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Asignar Rol</DialogTitle>
                        {selectedLineaUsuario && (
                            <DialogDescription>
                                Usuario: <strong>{selectedLineaUsuario.usuario}</strong>
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="rol" className="text-sm font-medium">Rol</label>
                            <select
                                id="rol"
                                className="w-full border rounded px-2 py-1"
                                value={selectedRolId ?? ''}
                                onChange={e => setSelectedRolId(Number(e.target.value))}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.rolId} value={rol.rolId}>{rol.rol}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenModalRol(false)} disabled={isAssigning}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmAssignRol} disabled={isAssigning || !selectedRolId}>
                            {isAssigning ? "Asignando..." : "Asignar Rol"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Modal de Edición */}
            <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
                <DialogContent className="sm:max-w-156.25">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    {selectedLineaUsuario && (
                        <FormEdithUsuario 
                            setOpenModalEdit={setOpenModalEdit}
                            lineaUsuario={selectedLineaUsuario}
                            onSuccess={handleCloseModal}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
