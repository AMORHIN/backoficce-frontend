import { Logo } from "@/components/Logo/Logo";
import React from "react";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">           
            <div className="flex flex-col items-center mt-16">
                <Logo/>
                <h1 className="text-3xl mt-4 mb-2">Bienvenido a Sharf</h1>
                <h2 className="text-2xl mb-4">Inicia sesión para continuar</h2>
            </div>
            <div className="flex items-center -mt-16">{children}</div>
        </div>
    );
}
