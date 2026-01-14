"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './insights.module.css';
import { useState } from 'react';
import clsx from 'clsx';

export interface WorkingHoursData {
    day: string;
    hours: number;
}

export default function WorkingHoursTrend({ data }: { data: WorkingHoursData[] }) {
    const [range, setRange] = useState<'7d' | '30d'>('7d');
    // For now we only implement one set of data passed from parent, or parent handles range.
    // To simplify, let's assume parent passes the correct data based on range, 
    // OR we just show what we have.
    // Given the complexity of "7d vs 30d" toggling requiring new fetches, 
    // let's currently render the data passed in.
    // If specific range toggling is needed, we'd need a callback or fetch in parent.
    // For this step, I will trust the parent to pass the relevant data.

    // However, if we want to keep the toggle UI working, we might need to handle it.
    // But since "remove static data" is the goal, let's make the chart depend on props.

    const chartData = data;

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
                    <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
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
