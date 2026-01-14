
"use client";

import { useEffect, useState } from 'react';
import TodayHeader from './TodayHeader';
import AttendanceCard from './AttendanceCard';
import Timeline from './Timeline';
import styles from './today.module.css';
import { subscribeToDailyAttendance, AttendanceRecord } from '@/lib/firestore-attendance';

export default function TodayView() {
    const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        const unsubscribe = subscribeToDailyAttendance("employee_001", selectedDate, (data) => {
            setAttendance(data);
        });

        return () => unsubscribe();
    }, [selectedDate]);

    const formatTime = (timeStr?: string) => {
        // timeStr can be ISO string or "14 Jan 2026 at 12:01 PM"
        if (!timeStr) return "--:-- --";

        // If it contains " at ", it's the formatted string we saved.
        // We'll try to extract just the time part if possible, specifically the 12:01 PM part?
        // Or if we want to display what was saved directly?
        // The UI usually expects a short time. 
        // "14 Jan 2026 at 12:01 PM"
        if (timeStr.includes(" at ")) {
            return timeStr.split(" at ")[1];
        }

        // Fallback for ISO strings
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr; // Return as is if invalid date

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateHours = (start?: string, end?: string) => {
        if (!start) return "0";

        const parseDate = (s: string) => {
            if (s.includes(" at ")) {
                // Parse "14 Jan 2026 at 12:01 PM" back to timestamp
                // Using Date.parse might work if format allows, but "at" is tricky.
                return new Date(s.replace(" at", ""));
            }
            return new Date(s);
        };

        const startTime = parseDate(start).getTime();
        const endTime = end ? parseDate(end).getTime() : Date.now();

        if (isNaN(startTime)) return "0";
        // If endTime is invalid (e.g. checkOut is null), use now. 
        // But if checkOut is being actively worked on, it might be null.

        const diff = (endTime - startTime) / (1000 * 60 * 60);
        return diff.toFixed(1);
    };

    return (
        <div className={styles.container}>
            <TodayHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <AttendanceCard
                checkIn={attendance?.checkIn ? formatTime(attendance.checkIn) : "--:-- --"}
                checkOut={attendance?.checkOut ? formatTime(attendance.checkOut) : "--:-- --"}
                totalHours={calculateHours(attendance?.checkIn, attendance?.checkOut)}
                status={attendance?.checkIn ? "Present" : "Absent"}
            />
            <Timeline attendance={attendance} />
        </div>
    );
}
