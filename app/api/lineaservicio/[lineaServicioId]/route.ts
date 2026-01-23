// import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definir tipos para el payload de actualización
interface UpdateLineaServicioPayload {
    lineaServicioId: number;
    nombre: string;
    codigo: string;
    estadoServicio: string;
    descripcion: string;
    updateUserId: number;
}

import { BASE_URL_API, API_KEY } from '@/lib/api';

// Validar datos del request
interface UpdateData {
    nombre: unknown;
    codigo: unknown;
    descripcion: unknown;
    estadoServicio: unknown;
}
function validateUpdateData(data: UpdateData, lineaServicioId: number): { valid: boolean; error?: string } {
    if (!data.nombre || typeof data.nombre !== 'string') {
        return { valid: false, error: 'El nombre es requerido' };
    }
    if (!data.codigo || typeof data.codigo !== 'string') {
        return { valid: false, error: 'El código es requerido' };
    }
    if (!data.descripcion || typeof data.descripcion !== 'string') {
        return { valid: false, error: 'La descripción es requerida' };
    }
    if (!data.estadoServicio || typeof data.estadoServicio !== 'string') {
        return { valid: false, error: 'El estado del servicio es requerido' };
    }
    if (!lineaServicioId || isNaN(lineaServicioId)) {
        return { valid: false, error: 'ID de línea de servicio inválido' };
    }
    return { valid: true };
}

// PUT - Actualizar línea de servicio
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ lineaServicioId: string }> }
) {
    try {
        // Await params en Next.js 15
        const { lineaServicioId: lineaServicioIdParam } = await params;
        const lineaServicioId = parseInt(lineaServicioIdParam);

        // Parsear datos del request
        let data;
        try {
            data = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, message: "Formato de datos inválido" }, 
                { status: 400 }
            );
        }

        // Validar datos
        const validation = validateUpdateData(data, lineaServicioId);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, message: validation.error }, 
                { status: 400 }
            );
        }

        // URL del API externo
        const apiUrl = `${BASE_URL_API}/LineaServicio/UpdateLineaServicio`;
        
        // Preparar payload según el curl proporcionado
        const updateUserIdNumber = 1; // Temporal, ajustar según tu lógica
        
        const payload: UpdateLineaServicioPayload = {
            lineaServicioId: lineaServicioId,
            nombre: data.nombre,
            codigo: data.codigo,
            estadoServicio: data.estadoServicio,
            descripcion: data.descripcion,
            updateUserId: updateUserIdNumber
        };

        // Llamar al API externo
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Error al actualizar la línea de servicio: ${errorText || 'Error desconocido'}` 
                }, 
                { status: response.status }
            );
        }

        const result = await response.text();
        
        return NextResponse.json({ 
            success: true, 
            data: result,
            message: "Línea de servicio actualizada exitosamente"
        });

    } catch (error) {        
        return NextResponse.json(
            { 
                success: false, 
                message: "Error interno del servidor" 
            }, 
            { status: 500 }
        );
    }
}
