"use client"

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { SidebarItem } from '../SidebarItem'  
import {dataGeneralSidebar, dataSuportSidebar,dataToolsSidebar} from './Sidebar.Routes.Data'

export function SidebarRoutes() {
  const [openSection, setOpenSection] = useState('GENERAL');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <div className='flex flex-col justify-between h-full'>
      <div>
        <div className='px-2 md:px-6 py-2'>
          <div className='flex items-center justify-between cursor-pointer mb-2' onClick={() => toggleSection('GENERAL')}>
            <p className='text-slate-700 dark:text-slate-300 font-semibold text-sm'>GENERAL</p>
            {openSection === 'GENERAL' ? <ChevronDown className='w-4 h-4 text-slate-700 dark:text-slate-300' /> : <ChevronRight className='w-4 h-4 text-slate-700 dark:text-slate-300' />}
          </div>
          {openSection === 'GENERAL' && dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <div className='px-2 md:px-6 py-2'>
          <div className='flex items-center justify-between cursor-pointer mb-2' onClick={() => toggleSection('TOOLS')}>
            <p className='text-slate-700 dark:text-slate-300 font-semibold text-sm'>TOOLS</p>
            {openSection === 'TOOLS' ? <ChevronDown className='w-4 h-4 text-slate-700 dark:text-slate-300' /> : <ChevronRight className='w-4 h-4 text-slate-700 dark:text-slate-300' />}
          </div>
          {openSection === 'TOOLS' && dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <div className='px-2 md:px-6 py-2'>
          <div className='flex items-center justify-between cursor-pointer mb-2' onClick={() => toggleSection('SUPPORT')}>
            <p className='text-slate-700 dark:text-slate-300 font-semibold text-sm'>SUPPORT</p>
            {openSection === 'SUPPORT' ? <ChevronDown className='w-4 h-4 text-slate-700 dark:text-slate-300' /> : <ChevronRight className='w-4 h-4 text-slate-700 dark:text-slate-300' />}
          </div>
          {openSection === 'SUPPORT' && dataSuportSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>
      <div>
        <footer className='mt-3 p-3 text-center text-xs text-slate-400'>
          2025 © Sharf Technologies Inc.
        </footer>
      </div>
    </div>
  )
}
