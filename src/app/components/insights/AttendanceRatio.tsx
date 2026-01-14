"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './insights.module.css';

export interface AttendanceRatioData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export default function AttendanceRatio({ data }: { data: AttendanceRatioData[] }) {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Attendance Ratio</h3>
            </div>

            <div className={styles.chartArea} style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            itemStyle={{ color: '#1e293b', fontWeight: 500 }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span style={{ color: '#64748b', fontSize: '12px' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
