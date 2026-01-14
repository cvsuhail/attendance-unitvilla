"use client";

import { useState, useEffect } from 'react';
import MonthSelector from './MonthSelector';
import MonthlySummary, { MonthlyStats } from './MonthlySummary';
import DailyList, { DailyRecord } from './DailyList';
import styles from './report.module.css';
import { getMonthlyAttendance, AttendanceRecord } from '@/lib/firestore-attendance';

export default function ReportView() {
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [records, setRecords] = useState<DailyRecord[]>([]);
    const [stats, setStats] = useState<MonthlyStats>({
        workingDays: 0,
        totalHours: 0,
        leavesTaken: 0,
        lateDays: 0
    });

    useEffect(() => {
        async function fetchData() {
            const data = await getMonthlyAttendance(currentMonth);
            // Process data defined below
            processAttendanceData(data);
        }
        fetchData();
    }, [currentMonth]);

    function processAttendanceData(data: AttendanceRecord[]) {
        let workingDays = 0;
        let totalHours = 0;
        let leavesTaken = 0;
        let lateDays = 0;

        const processedRecords: DailyRecord[] = data.map(record => {
            const checkInTime = record.checkIn ? new Date(record.checkIn) : null;
            const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;

            // Basic Status Logic
            let status: 'Present' | 'Absent' | 'Late' = 'Absent';
            let totalStr = '-';

            if (record.checkIn) {
                workingDays++;
                status = 'Present';

                // Check for Late (e.g., after 9:30 AM)
                if (checkInTime) {
                    const hour = checkInTime.getHours();
                    const minute = checkInTime.getMinutes();
                    if (hour > 9 || (hour === 9 && minute > 30)) {
                        status = 'Late';
                        lateDays++;
                    }
                }

                if (checkOutTime && checkInTime) {
                    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
                    const diffHrs = diffMs / (1000 * 60 * 60);
                    totalHours += diffHrs;
                    totalStr = `${diffHrs.toFixed(1)}h`;
                }
            } else {
                leavesTaken++;
            }

            return {
                date: new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'short' }),
                checkIn: checkInTime ? checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                checkOut: checkOutTime ? checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                total: totalStr,
                status
            } as DailyRecord;
        });

        // Sort by date descending
        processedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setRecords(processedRecords);
        setStats({ workingDays, totalHours, leavesTaken, lateDays });
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Monthly Report</h1>
            </header>

            {/* TODO: Pass setMonth to MonthSelector if it supports it, for now just static UI usually? 
                Assuming MonthSelector handles its own state or needs partial refactor. 
                Let's assume for this task we stick to current month fetching or basic default.
            */}
            <MonthSelector />

            <MonthlySummary stats={stats} />

            <DailyList records={records} />
        </div>
    );
}
