"use client"

import  Link  from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { SidebarItemProps } from "./SidebarItem.types";
import { useState } from "react";
import { ChevronDown, ChevronRight, Dot } from "lucide-react";

export function SidebarItem(props: SidebarItemProps) {
    const { item } = props;
    const { href, icon: Icon, label, children } = item;

    const pathname = usePathname();

    // Solo resalta el padre si está en su ruta exacta
    const activePath = pathname === href;
    // Si algún hijo es activo
    const isChildActive = Array.isArray(children) && children.some(child => pathname === child.href || pathname.startsWith(child.href + "/"));

    const [open, setOpen] = useState(activePath || isChildActive);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (children) {
            e.preventDefault();
            setOpen((prev) => !prev);
        }
    };

    return (
        <div>
            {children ? (
                <button
                    type="button"
                    className={cn(
                        'w-full flex items-center gap-2 mt-1 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-700/50 p-2 rounded-lg cursor-pointer transition-colors',
                        activePath && 'font-semibold',
                        open && 'bg-gray-100'
                    )}
                    style={activePath ? { background: '#e5e7eb', color: '#111827' } : {}}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <Icon className={cn('h-4 w-4 mr-2', activePath ? 'text-[#111827]' : 'text-slate-700')} strokeWidth={2.5} />
                    <span className="font-normal flex-1 text-left">{label}</span>
                    <span>{open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                </button>
            ) : (
                <Link
                    href={href}
                    className={cn(
                        'flex gap-x-4 mt-1 text-slate-700 dark:text-slate-300 text-sm items-center hover:bg-slate-200/60 dark:hover:bg-slate-700/50 p-2 rounded-lg cursor-pointer transition-colors',
                        activePath && 'font-semibold'
                    )}
                    style={activePath ? { background: '#e5e7eb', color: '#111827' } : {}}
                >
                    <div className={cn('p-1.5 rounded-full bg-transparent')}>
                        <Icon className={cn('h-4 w-4', activePath ? 'text-[#111827]' : 'text-slate-700')} strokeWidth={2.5} />
                    </div>
                    <span className="font-normal flex-1">{label}</span>
                </Link>
            )}
            {children && open && (
                <div className="pl-8 border-l-2 border-gray-200 ml-2 mt-0.5 flex flex-col gap-0.5">
                    <div className="h-0.5" />
                    {children.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        const ChildIcon = child.icon;
                        return (
                            <Link
                                key={child.label}
                                href={child.href}
                                className={cn(
                                    'flex items-center gap-x-2 text-sm rounded-md px-3 py-1 transition-colors',
                                    childActive ? 'bg-gray-200 text-[#111827] font-semibold shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
                                )}
                                style={childActive ? { background: '#e5e7eb', color: '#111827', marginTop: 2 } : { marginTop: 2 }}
                            >
                                <ChildIcon className={cn('w-4 h-4', childActive ? 'text-[#111827]' : 'text-slate-400')} />
                                <span>{child.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}