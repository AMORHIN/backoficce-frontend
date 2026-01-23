import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const API_BASE_URL = 'https://sorter-backoffice-prod-fuc8cdf7bggthwgy.eastus2-01.azurewebsites.net/api';
const API_KEY = 'Tu2POBHeBu4pHDMXTveCzLCbXwkWl$arh#$qwerTyuiopgHjklzXSharf';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fechaInicio = searchParams.get('FechaInicio');
        const fechaFin = searchParams.get('FechaFin');
        
        let url = `${API_BASE_URL}/ChutePedido/GetStatusChutePedido`;
        
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
