import{
    BarChart4,
    Building2,
    PanelsTopLeft,
    Settings,
    ShieldCheck,
    CircleHelpIcon,
    Calendar,
    ShoppingBag,
    Truck,
    Package,
    FileSpreadsheet,
    FileX,
    FileCheck,
    ListChecks,
    User,
    RollerCoasterIcon
} from 'lucide-react'

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Dashboard",
        href : "/dashboard"
    },
    {
        icon: Building2,
        label: "Linea de Servicio",
        href : "/dashboard/lineaservicio"
    },
    {
        icon: Package,
        label: "Pedidos",
        href : "/dashboard/pedidos",
        children: [
            {
                label: "PedidosNoProcesados",
                href: "/dashboard/pedidos/PedidosNoProcesados",
                icon: FileX
            },
            {
                label: "PedidosProcesados",
                href: "/dashboard/pedidos/PedidosProcesados",
                icon: FileCheck
            },
            {
                label: "PedidosSorteados",
                href: "/dashboard/pedidos/PedidosSorteados",
                icon: ListChecks
            }
        ]
    },
    {
        icon:  FileSpreadsheet,
        label: "Importar Documentos",
        href : "/dashboard/documentos"
    }
]

export const dataToolsSidebar = [
    {
        icon: CircleHelpIcon,
        label: "Faqs",
        href : "/faqs"
    },
    {
        icon: BarChart4,
        label: "Analytics",
        href : "/analytics"
    }
]

export const dataSuportSidebar = [
    {      
        icon: Settings,
        label: "Configuracion",
        href : "/configuracion"
    },
    // {
    //     icon: ShieldCheck, 
    //     label: "Seguridad",
    //     href : "/seguridad"
    // },
    {
        icon: ShieldCheck,
        label: "Seguridad",
        href : "/dashboard/seguridad",
        children: [
            {
                label: "Usuarios",
                href: "/dashboard/seguridad/usuarios",
                icon: User
            },
            {
                label: "Roles",
                href: "/dashboard/seguridad/roles",
                icon: RollerCoasterIcon
            }       
        ]
    },
]