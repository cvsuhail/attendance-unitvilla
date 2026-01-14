"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TodayHeader from './TodayHeader';
import AttendanceCard from './AttendanceCard';
import Timeline from './Timeline';
import styles from './today.module.css';

export default function TodayView() {
    const [attendance, setAttendance] = useState<any>(null);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        // Hardcoded employee_001 for now as per instructions
        const docRef = doc(db, "attendance", `employee_001_${today}`);

        const unsub = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setAttendance(doc.data());
            } else {
                setAttendance(null);
            }
        });

        return () => unsub();
    }, []);

    const formatTime = (isoString: string) => {
        if (!isoString) return "--:-- --";
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateHours = (start: string, end?: string) => {
        if (!start) return "0";
        const startTime = new Date(start).getTime();
        const endTime = end ? new Date(end).getTime() : Date.now();
        const diff = (endTime - startTime) / (1000 * 60 * 60);
        return diff.toFixed(1);
    };

    return (
        <div className={styles.container}>
            <TodayHeader />
            <AttendanceCard
                checkIn={attendance?.checkIn ? formatTime(attendance.checkIn) : "--:-- --"}
                checkOut={attendance?.checkOut ? formatTime(attendance.checkOut) : "--:-- --"}
                totalHours={calculateHours(attendance?.checkIn, attendance?.checkOut)}
                status={attendance?.checkIn ? "Present" : "Absent"}
            />
            <Timeline />
        </div>
    );
}
