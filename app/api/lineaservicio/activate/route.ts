// import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Definir tipos para el payload de activación
interface ActivarLineaServicioPayload {
    lineaServicioId: number;
    estadoServicio: string;
    updateUserId: number;
}

// PUT - Activar/Cambiar estado de línea de servicio
export async function PUT(req: Request) {
    try {
        // const {userId} = await auth();

        // Verificar autenticación
        // if (!userId) {
        //     return NextResponse.json(
        //         { success: false, message: "No autorizado" }, 
        //         { status: 401 }
        //     );
        // }

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
        if (!data.lineaServicioId || typeof data.lineaServicioId !== 'number') {
            return NextResponse.json(
                { success: false, message: 'El ID de línea de servicio es requerido' }, 
                { status: 400 }
            );
        }
        if (!data.estadoServicio || typeof data.estadoServicio !== 'string') {
            return NextResponse.json(
                { success: false, message: 'El estado del servicio es requerido' }, 
                { status: 400 }
            );
        }

        // Importar al inicio del archivo
        const { BASE_URL_API, API_KEY } = await import('@/lib/api');
        const apiUrl = BASE_URL_API;

        // Preparar payload según el curl proporcionado
        const payload: ActivarLineaServicioPayload = {
            lineaServicioId: data.lineaServicioId,
            estadoServicio: data.estadoServicio,
            updateUserId: data.updateUserId || 1
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
            console.error("Error del API externo:", errorText);
            
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Error al cambiar el estado: ${errorText || 'Error desconocido'}` 
                }, 
                { status: response.status }
            );
        }

        const result = await response.text();
        
        return NextResponse.json({ 
            success: true, 
            data: result,
            message: "Estado actualizado exitosamente"
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
