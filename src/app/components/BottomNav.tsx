"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, BarChart2, FileText } from 'lucide-react';
import styles from './BottomNav.module.css';
import clsx from 'clsx';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Today',
            path: '/today',
            icon: Calendar,
        },
        {
            label: 'Insights',
            path: '/insights',
            icon: BarChart2,
        },
        {
            label: 'Report',
            path: '/report',
            icon: FileText,
        },
    ];

    return (
        <nav className={styles.navContainer}>
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={clsx(styles.navItem, isActive && styles.active)}
                    >
                        <div className={styles.iconContainer}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={styles.label}>{item.label}</span>
                        {isActive && <div className={styles.indicator} />}
                    </Link>
                );
            })}
        </nav>
    );
}
