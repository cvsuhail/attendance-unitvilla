"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './insights.module.css';
import { useState } from 'react';
import clsx from 'clsx';

const data7Days = [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.5 },
    { day: 'Fri', hours: 6.8 },
    { day: 'Sat', hours: 4.5 },
    { day: 'Sun', hours: 0 },
];

const data30Days = [
    { day: '1', hours: 8 }, { day: '5', hours: 7 }, { day: '10', hours: 9 }, { day: '15', hours: 8.5 },
    { day: '20', hours: 7.5 }, { day: '25', hours: 8 }, { day: '30', hours: 9 },
];

export default function WorkingHoursTrend() {
    const [range, setRange] = useState<'7d' | '30d'>('7d');
    const data = range === '7d' ? data7Days : data30Days;

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Working Hours Trend</h3>
                <div className={styles.chartToggle}>
                    <button
                        className={clsx(styles.toggleBtn, range === '7d' && styles.toggleBtnActive)}
                        onClick={() => setRange('7d')}
                    >
                        7 Days
                    </button>
                    <button
                        className={clsx(styles.toggleBtn, range === '30d' && styles.toggleBtnActive)}
                        onClick={() => setRange('30d')}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                            cursor={{ stroke: '#e2e8f0' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="hours"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
