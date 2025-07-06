"use client" 
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from 'next/link' 
function Header() {

    const path = usePathname()
    
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'> 
        <Link href="/dashboard">
            <Image src={'/logo.svg'} width={160} height={100} alt='logo' className='cursor-pointer' /> 
        </Link>
        
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all ${path === '/dashboard' && 'text-primary font-bold'}`} >
                <Link href="/dashboard" className="block w-full h-full">
                    Dashboard
                </Link>
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all ${path === '/dashboard/questions' && 'text-primary font-bold'}`} >
                <Link href="/dashboard/coming-soon" className="block w-full h-full">
                    Questions
                </Link>
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all ${path === '/dashboard/upgrade' && 'text-primary font-bold'}`} >
                <Link href="/dashboard/coming-soon" className="block w-full h-full">
                    Upgrade
                </Link>
            </li>
            <li className={`hover:text-primary hover:font-bold transition-all ${path === '/dashboard/how' && 'text-primary font-bold'}`} >
                <Link href="/dashboard/coming-soon" className="block w-full h-full">
                    How it Works?
                </Link>
            </li>
        </ul>
        <UserButton />
    </div>
  )
}

export default Header