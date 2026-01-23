import { LucideIcon } from 'lucide-react';

export type SidebarMenuChild = {
    label: string;
    href: string;
    icon: LucideIcon;
};

export type SidebarMenuItem = {
    label: string;
    icon: LucideIcon;
    href: string;
    children?: SidebarMenuChild[];
};

export type SidebarItemProps = {
    item: SidebarMenuItem;
    key: string;
};
