"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";
import { CardSummary } from "../(routes)/components/CardSummary";
import { BookOpenCheck, List, UsersRound, Waypoints } from "lucide-react";
import { LastCustomers } from "../(routes)/components/LastCustomers";
import { SalesDistributors } from "../(routes)/components/SalesDistributors";
import { TotalSuscribers } from "../(routes)/components/TotalSuscribers";
import { ListIntegrations } from "../(routes)/components/ListIntegrations";

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        <CardSummary 
          icon={UsersRound}
          total="12.450"
          average={15}
          title="Cantidad de robots"
          tooltipText="Ver cantidad de robots operativos"
        />
        <CardSummary
          icon={Waypoints}
          total="86.5%"
          average={80}
          title="Cantidad sorteados Urbano"
          tooltipText="Ver total de pedidos sorteados por día"
        />
        <CardSummary
          icon={BookOpenCheck}
          total="363.95&"
          average={30}
          title="Cantidad sorteados Rural"
          tooltipText="Ver total de pedidos sorteados por día"
        />
      </div>

      <div className="grid grid-cols-1 mt-12 xl:grid-cols-2 md:gap-x-10 ">
        <LastCustomers />
        <SalesDistributors />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-x-10 mt-12 md:mb-10">
        <TotalSuscribers />
        <ListIntegrations />
      </div>
    </div>
  );
}
