import { Logo } from "@/components/Logo/Logo";
import React from "react";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-center h-full items-center">     
            <Logo/>
            <h1 className="text-3xl my-2">Bienvenido a Sharf</h1>
            <h2 className="text-2xl mb-1">Inicia sesión para continuar</h2>
            {children}
        </div>
    );
}