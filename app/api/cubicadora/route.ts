import { NextResponse, NextRequest } from 'next/server';
import { BASE_URL_API, API_KEY } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fechaInicio = searchParams.get('FechaInicio');
        const fechaFin = searchParams.get('FechaFin');
        
        let url = `${BASE_URL_API}/Cubicadora/GetCubicadora`;
        
        if (fechaInicio && fechaFin) {
            url += `?FechaInicio=${encodeURIComponent(fechaInicio)}&FechaFin=${encodeURIComponent(fechaFin)}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Error al obtener pedidos' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en la API:', error);
        return NextResponse.json(
            { success: false, message: 'Error de conexión' },
            { status: 500 }
        );
    }
}
