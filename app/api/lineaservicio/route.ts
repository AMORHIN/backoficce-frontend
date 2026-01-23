import { NextResponse } from "next/server";

import { BASE_URL_API, API_KEY } from '@/lib/api';

// Definir tipos para el payload
interface LineaServicioPayload {
    nombre: string;
    codigo: string;
    descripcion: string;
    estadoServicio: string;
    createUserId: number;
}

// Tipo para la respuesta de líneas de servicio
interface LineaServicio {
    lineaServicioId: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    estadoServicio: string;
    createUserId: number;
    createDate: string;
    updateUserId?: number;
    updateDate?: string;
}

// Validar datos del request
interface RequestData {
    nombre: unknown;
    codigo: unknown;
    descripcion: unknown;
    estadoServicio: unknown;
}
function validateRequestData(data: RequestData): { valid: boolean; error?: string } {
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
    return { valid: true };
}

// GET - Obtener todas las líneas de servicio
export async function GET(req: Request) {
    try {
        // URL del API externo
        const apiUrl = `${BASE_URL_API}/LineaServicio/GetAllLineaServicio`;
        
        // Llamar al API externo
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY
            },
            cache: 'no-store' // No cachear para siempre obtener datos frescos
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Error al obtener líneas de servicio: ${errorText || 'Error desconocido'}` 
                }, 
                { status: response.status }
            );
        }

        const result = await response.json();
        
        return NextResponse.json({ 
            success: true, 
            data: result.data || result,
            message: "Líneas de servicio obtenidas exitosamente"
        });

    } catch (error: unknown) {
        let message = "Error interno del servidor";
        if (error instanceof Error) message = error.message;
        return NextResponse.json(
            { 
                success: false, 
                message
            }, 
            { status: 500 }
        );
    }
}

// POST - Crear línea de servicio
export async function POST(req: Request) {
    try {
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
        const validation = validateRequestData(data);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, message: validation.error }, 
                { status: 400 }
            );
        }

        // Preparar payload para el API externo
        const apiUrl = `${BASE_URL_API}/LineaServicio/CrearLineaServicio`;
        
        const userIdNumber = 1;
        
        const payload: LineaServicioPayload = {
            nombre: data.nombre,
            codigo: data.codigo,
            descripcion: data.descripcion,
            estadoServicio: data.estadoServicio,
            createUserId: userIdNumber
        };

        // Llamar al API externo
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
                'ApiKey': API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Error al crear la línea de servicio: ${errorText || 'Error desconocido'}` 
                }, 
                { status: response.status }
            );
        }

        const result = await response.text();
        
        return NextResponse.json({ 
            success: true, 
            data: result,
            message: "Línea de servicio creada exitosamente"
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