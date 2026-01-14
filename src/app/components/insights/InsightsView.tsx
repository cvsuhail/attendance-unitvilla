"use client";

import { useState, useEffect } from 'react';
import SummaryMetrics, { MetricData } from './SummaryMetrics';
import WorkingHoursTrend, { WorkingHoursData } from './WorkingHoursTrend';
import CheckInBehavior, { CheckInStats } from './CheckInBehavior';
import AttendanceRatio, { AttendanceRatioData } from './AttendanceRatio';
import styles from './insights.module.css';
import { getMonthlyAttendance, AttendanceRecord } from '@/lib/firestore-attendance';

export default function InsightsView() {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState<MetricData>({
        avgCheckIn: '-',
        avgWorkHrs: '-',
        onTimePercentage: '-',
        lateDays: '-'
    });
    const [checkInBehavior, setCheckInBehavior] = useState<CheckInStats[]>([]);
    const [workingHoursTrend, setWorkingHoursTrend] = useState<WorkingHoursData[]>([]);
    const [attendanceRatio, setAttendanceRatio] = useState<AttendanceRatioData[]>([]);

    useEffect(() => {
        async function fetchData() {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const data = await getMonthlyAttendance(currentMonth);
            processInsightsData(data);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    function processInsightsData(data: AttendanceRecord[]) {
        if (!data.length) return;

        let totalCheckInMinutes = 0;
        let checkInCount = 0;
        let totalWorkHours = 0;
        let workHoursCount = 0;
        let lateCount = 0;
        let onTimeCount = 0;
        let workingDaysCount = 0;

        // Behavior counts
        let before9 = 0;
        let nineToNineThirty = 0;
        let nineThirtyToTen = 0;
        let after10 = 0;

        // Ratio counts
        let presentCount = 0;
        // Absent is tricky because we only have records for check-ins usually?
        // Or if we have explicit absent records. 
        // For now, let's assume records = present. 
        // We'd need total working days in month - present to guess absent?
        // Let's stick to what we have in data.

        const trendMap: Record<string, number> = {};

        data.forEach(record => {
            if (record.checkIn) {
                presentCount++;
                workingDaysCount++;
                const checkIn = new Date(record.checkIn);
                const hour = checkIn.getHours();
                const minute = checkIn.getMinutes();

                // Avg Check In
                totalCheckInMinutes += hour * 60 + minute;
                checkInCount++;

                // Behavior (Simple Logic)
                if (hour < 9) {
                    before9++;
                } else if (hour === 9) {
                    if (minute <= 30) nineToNineThirty++;
                    else nineThirtyToTen++;
                } else {
                    after10++;
                }

                // Late/OnTime
                if (hour > 9 || (hour === 9 && minute > 30)) {
                    lateCount++;
                } else {
                    onTimeCount++;
                }

                if (record.checkOut) {
                    const checkOut = new Date(record.checkOut);
                    const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                    totalWorkHours += diff;
                    workHoursCount++;

                    // Trend
                    const dayName = checkIn.toLocaleDateString('en-US', { weekday: 'short' });
                    // Basic trend: just accumulate hours per day-of-week? Or actual dates?
                    // WorkingHoursTrend expects per-day. Let's do last 7 records for simplicity or map by day.
                    // The static data was "Mon, Tue...". Let's try to map to that if plenty data, or specific dates.
                    // Let's us day of month for 30d view style if simpler.
                    // Let's go with Day name accumulation / count to get Avg per day?
                    // Or simply map the last 7 entries.
                    // Let's map actual last 7 entries for the "7d" view (which is default).
                }
            }
        });

        // Prepare Trend Data (Last 7 Days from data sorted by date)
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const last7 = sortedData.slice(-7);
        const trendData = last7.map(r => {
            let hours = 0;
            if (r.checkIn && r.checkOut) {
                hours = (new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60);
            }
            return {
                day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
                hours: parseFloat(hours.toFixed(1))
            };
        });
        setWorkingHoursTrend(trendData);

        const avgCheckInMinutes = checkInCount > 0 ? totalCheckInMinutes / checkInCount : 0;
        const avgH = Math.floor(avgCheckInMinutes / 60);
        const avgM = Math.floor(avgCheckInMinutes % 60);
        const ampm = avgH >= 12 ? 'PM' : 'AM';
        const displayH = avgH % 12 || 12;
        const avgCheckInStr = checkInCount > 0 ? `${displayH}:${avgM.toString().padStart(2, '0')} ${ampm}` : '-';

        const avgWorkHrsStr = workHoursCount > 0 ? `${(totalWorkHours / workHoursCount).toFixed(1)} Hrs` : '-';
        const onTimePctStr = workingDaysCount > 0 ? `${Math.round((onTimeCount / workingDaysCount) * 100)}%` : '-';

        setMetrics({
            avgCheckIn: avgCheckInStr,
            avgWorkHrs: avgWorkHrsStr,
            onTimePercentage: onTimePctStr,
            lateDays: `${lateCount} Days`
        });

        setCheckInBehavior([
            { time: 'Before 9', count: before9, status: 'early' },
            { time: '9:00 - 9:30', count: nineToNineThirty, status: 'ontime' },
            { time: '9:30 - 10', count: nineThirtyToTen, status: 'late' },
            { time: 'After 10', count: after10, status: 'late' },
        ]);

        // Ratio Data
        // For real app, we need total days vs present. 
        // Logic: Present = presentCount. Late is included in Present usually, or separate slice?
        // Chart showed Present, Absent, Half Day, Leave.
        // Let's keep it simple: Present (OnTime), Late, Leave (dummy for now if no data), Absent.
        setAttendanceRatio([
            { name: 'On Time', value: onTimeCount, color: '#22c55e' },
            { name: 'Late', value: lateCount, color: '#f59e0b' },
            // Keeping placeholders 0 to avoid breaking chart look if empty
            { name: 'Absent', value: 0, color: '#ef4444' },
            { name: 'Leave', value: 0, color: '#94a3b8' },
        ]);
    }

    if (isLoading) return <div className="p-8 text-center">Loading insights...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Insights</h1>
                <p className={styles.subtitle}>Your attendance patterns this month</p>
            </header>

            <SummaryMetrics data={metrics} />

            {/* Defaulting to 7d view logic with last 7 entries */}
            <WorkingHoursTrend data={workingHoursTrend} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <CheckInBehavior chartData={checkInBehavior} />
                <AttendanceRatio data={attendanceRatio} />
            </div>
        </div>
    );
}
