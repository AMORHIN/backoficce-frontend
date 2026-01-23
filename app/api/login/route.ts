
import { BASE_URL_API } from '@/lib/api';
import { NextResponse } from 'next/server';
// import { request } from 'https';

// Assuming this is an API route handler function
export async function POST(request: Request) {
	try {
		const { username, password } = await request.json();

		// Llamar al endpoint real de login (según el curl)
		const response = await fetch(`${BASE_URL_API}/User/Login`, {
			method: 'POST',
			headers: {
				'accept': 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userName: username,
				password,
			}),
		});

		const data = await response.json();

		// Si el backend responde con Success: false o Status >= 400, mostrar el mensaje tal cual
		if (data.Success === false || response.status >= 400) {
			return NextResponse.json({
				success: false,
				message: data.Message,
				status: data.Status,
				errors: data.Errors,
				data: data.Data
			}, { status: data.Status || 500 });
		}

		// Si es éxito, devolver el objeto completo
		return NextResponse.json({
			success: true,
			...data
		});
	} catch (error) {
		return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
	}
}
