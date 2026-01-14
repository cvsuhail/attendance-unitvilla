"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './insights.module.css';

export interface CheckInStats {
    time: string;
    count: number;
    status: 'early' | 'ontime' | 'late';
}

export default function CheckInBehavior({ chartData }: { chartData: CheckInStats[] }) {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Check-In Behavior</h3>
            </div>

            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.status === 'late' ? '#f59e0b' : entry.status === 'early' ? '#14b8a6' : '#4f46e5'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
