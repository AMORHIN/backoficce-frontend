"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL_API } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";
import { FormEditRol } from "../FormEditRol/FormEditRol";

export type Rol = {
  rolId: number;
  rol: string;
  codigo: string;
  descripcion: string;
};

export function ListRol({ reloadRef }: { reloadRef?: React.MutableRefObject<() => void> }) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  // Seguridad: solo admin (rolId=1)
  const isNotAdmin = user && user.rolId !== 1;

  const fetchData = async () => {
    if (isNotAdmin) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL_API}/Rol/GetAllRol`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
        },
      });
      if (response.data.success) {
        setRoles(response.data.data || []);
      }
    } catch (error) {
      setRoles([]);
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

  if (isNotAdmin) {
    return (
      <div className="flex items-center justify-center h-96 text-lg font-semibold">
        Usted no tiene acceso a este módulo.
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
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">No hay roles registrados.</td>
            </tr>
          ) : (
            roles.map((rol, idx) => (
              <tr key={rol.rolId}>
                <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rol.rol}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rol.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{rol.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-4 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedRol(rol); setOpenModalEdit(true); }}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal de edición */}
      <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
          </DialogHeader>
          {selectedRol && (
            <FormEditRol
              rol={selectedRol}
              setOpenModalEdit={setOpenModalEdit}
              onSuccess={fetchData}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
