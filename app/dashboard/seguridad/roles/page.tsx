"use client";
import HeaderRol from "./components/HeaderRol/HeaderRol";
import { ListRol } from "./components/ListRol/ListRol";
import { useRef } from "react";

export default function RolesPage() {
  const reloadRef = useRef<() => void>(() => {});
  return (
    <div>
      <HeaderRol onRolCreated={() => reloadRef.current && reloadRef.current()} />
      <ListRol reloadRef={reloadRef} />
    </div>
  );
}
