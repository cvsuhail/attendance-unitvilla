import { Clock, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import styles from './insights.module.css';

export interface MetricData {
    avgCheckIn: string;
    avgWorkHrs: string;
    onTimePercentage: string;
    lateDays: string;
}

export default function SummaryMetrics({ data }: { data: MetricData }) {
    const metrics = [
        {
            label: 'Avg Check-In',
            value: data.avgCheckIn,
            icon: Clock,
            color: '#4f46e5',
            bg: '#eef2ff'
        },
        {
            label: 'Avg Work Hrs',
            value: data.avgWorkHrs,
            icon: TrendingUp,
            color: '#14b8a6',
            bg: '#f0fdfa'
        },
        {
            label: 'On Time',
            value: data.onTimePercentage,
            icon: Calendar,
            color: '#22c55e',
            bg: '#f0fdf4'
        },
        {
            label: 'Late Days',
            value: data.lateDays,
            icon: AlertCircle,
            color: '#f59e0b',
            bg: '#fffbeb'
        }
    ];

    return (
        <div className={styles.summaryGrid}>
            {metrics.map((m, i) => {
                const Icon = m.icon;
                return (
                    <div key={i} className={styles.summaryCard}>
                        <div className={styles.metricIcon} style={{ backgroundColor: m.bg, color: m.color }}>
                            <Icon size={18} />
                        </div>
                        <div className={styles.metricValue}>{m.value}</div>
                        <div className={styles.metricLabel}>{m.label}</div>
                    </div>
                );
            })}
        </div>
    );
}
