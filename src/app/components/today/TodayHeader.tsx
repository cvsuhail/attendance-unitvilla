"use client";

import styles from './today.module.css';
import clsx from 'clsx';
import { useMemo } from 'react';

interface TodayHeaderProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function TodayHeader({ selectedDate, onDateChange }: TodayHeaderProps) {
    const days = useMemo(() => {
        const today = new Date();
        const dates = [];
        // Show last 7 days ending with today? Or centered? 
        // User requesting "don't show future dates".
        // Let's show today and previous 6 days.
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            dates.push({
                date: d,
                num: d.getDate(),
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                isFuture: d > today
            });
        }
        return dates;
    }, []);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    return (
        <>
            <div className={styles.header}>
                <div className={styles.welcomeText}>Good Morning,</div>
                <h1 className={styles.welcome}>Amina Abdulla</h1>
                <div className={styles.dateRow}>
                    <span className={styles.currentDate}>
                        {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={clsx(styles.statusPill, styles.statusPresent)}>Present</span>
                </div>
            </div>

            <div className={styles.daySelector}>
                {days.map((dayItem) => (
                    <div
                        key={dayItem.num}
                        className={clsx(
                            styles.dayItem,
                            isSameDay(selectedDate, dayItem.date) && styles.dayItemActive
                        )}
                        onClick={() => onDateChange(dayItem.date)}
                    >
                        <span className={styles.dayName}>{dayItem.name}</span>
                        <span className={styles.dayNumber}>{dayItem.num}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
