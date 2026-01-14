"use client";

import { useState } from 'react';
import styles from './today.module.css';
import clsx from 'clsx';

export default function TodayHeader() {
    const [selectedDay, setSelectedDay] = useState(14); // Mock selected day

    // Mock days around current date
    const days = [
        { num: 11, name: 'Sun' },
        { num: 12, name: 'Mon' },
        { num: 13, name: 'Tue' },
        { num: 14, name: 'Wed' },
        { num: 15, name: 'Thu' },
        { num: 16, name: 'Fri' },
        { num: 17, name: 'Sat' },
    ];

    return (
        <>
            <div className={styles.header}>
                <div className={styles.welcomeText}>Good Morning,</div>
                <h1 className={styles.welcome}>Amina Abdulla</h1>
                <div className={styles.dateRow}>
                    <span className={styles.currentDate}>Wed, 14 Jan 2026</span>
                    <span className={clsx(styles.statusPill, styles.statusPresent)}>Present</span>
                </div>
            </div>

            <div className={styles.daySelector}>
                {days.map((day) => (
                    <div
                        key={day.num}
                        className={clsx(styles.dayItem, selectedDay === day.num && styles.dayItemActive)}
                        onClick={() => setSelectedDay(day.num)}
                    >
                        <span className={styles.dayName}>{day.name}</span>
                        <span className={styles.dayNumber}>{day.num}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
