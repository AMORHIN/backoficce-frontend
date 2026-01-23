import { CustomIcon } from "@/components/CustomIcon"
import { List } from "lucide-react"
import { TablaIntegrations } from "../TableIntegrations"

export function ListIntegrations() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 w-full">
        <div className="flex pag-x-2 items-center">
            <CustomIcon icon={List}/>
            <p className="text-xl">List Integrations</p>
        </div>
        <TablaIntegrations />
    </div>
  )
}
