import { CustomIcon } from "@/components/CustomIcon";
import { Building } from "lucide-react";
import { CustomersTable } from "../CustomersTable";



export  function LastCustomers() {
  return (
    <div className="p-5 rounded-lg shadow-sm bg-background ">
        <div className="flex items-center gap-x-2">
            <CustomIcon icon={Building}/>
            <p className="text-xl">Las customers</p>
        </div>
        <div>
            <CustomersTable />
        </div>
    </div>
  )
}
