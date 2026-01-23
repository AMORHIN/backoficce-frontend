import axios from "axios";
import { NextResponse } from "next/server";

import { BASE_URL_API, API_KEY } from '@/lib/api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const FechaInicio = searchParams.get("FechaInicio");
    const FechaFin = searchParams.get("FechaFin");
    const response = await axios.get(
      `${BASE_URL_API}/ChutePedido/GetStatusChutePedido`,
      {
        params: {
          FechaInicio,
          FechaFin,
        },
        headers: {
          ApiKey: API_KEY,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let message = "Error interno del servidor";
    let details = undefined;
    if (error instanceof Error) message = error.message;
    if (typeof error === "object" && error && "response" in error) {
      if (typeof error === "object" && error && "response" in error) {
        details = (error as { response?: { data?: unknown } }).response?.data;
      }
    }
    return NextResponse.json({ error: message, details }, { status: 500 });
  }
}
