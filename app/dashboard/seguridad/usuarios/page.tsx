"use client";
import HeaderUsuario from "./components/HeaderUsuario/HeaderUsuario";
import { ListUsuario } from "./components/ListUsuario/ListUsuario";
import { useRef } from "react";

export default function UsuariosPage() {
  const reloadRef = useRef<() => void>(() => {});
  return (
    <div>
      <HeaderUsuario onUserCreated={() => reloadRef.current && reloadRef.current()} />
      <ListUsuario reloadRef={reloadRef} />
    </div>
  );
}
