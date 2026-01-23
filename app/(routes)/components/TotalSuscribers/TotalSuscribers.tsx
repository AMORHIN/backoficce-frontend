"use client"

import { Percent } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts"
import { CustomIcon } from "@/components/CustomIcon"
import { dataTotalSuscribers } from "./TotalSuscribers.data"



export function TotalSuscribers() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 w-full hover:shadow-lg transition">
        <div className="flex gap-x-2 items-center mb-4">
            <CustomIcon icon={Percent} />
            <p className="text-xl">Total Suscribers</p>        
        </div>
        <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie 
                        dataKey="value"
                        data={dataTotalSuscribers}
                        cx="50%"
                        cy="45%"
                        outerRadius={70}
                        labelLine={false}
                    >
                        {dataTotalSuscribers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}
