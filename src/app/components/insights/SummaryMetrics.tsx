import { Clock, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import styles from './insights.module.css';

export default function SummaryMetrics() {
    const metrics = [
        {
            label: 'Avg Check-In',
            value: '09:45 AM',
            icon: Clock,
            color: '#4f46e5',
            bg: '#eef2ff'
        },
        {
            label: 'Avg Work Hrs',
            value: '8.2 Hrs',
            icon: TrendingUp,
            color: '#14b8a6',
            bg: '#f0fdfa'
        },
        {
            label: 'On Time',
            value: '92%',
            icon: Calendar,
            color: '#22c55e',
            bg: '#f0fdf4'
        },
        {
            label: 'Late Days',
            value: '2 Days',
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
