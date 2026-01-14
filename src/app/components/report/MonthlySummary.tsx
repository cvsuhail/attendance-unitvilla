import styles from './report.module.css';

export interface MonthlyStats {
    workingDays: number;
    totalHours: number;
    leavesTaken: number;
    lateDays: number;
}

export default function MonthlySummary({ stats }: { stats: MonthlyStats }) {
    const summaryItems = [
        { label: 'Working Days', value: stats.workingDays.toString() },
        { label: 'Total Hours', value: stats.totalHours.toFixed(1) },
        { label: 'Leaves Taken', value: stats.leavesTaken.toString() },
        { label: 'Late Days', value: stats.lateDays.toString() },
    ];

    return (
        <div className={styles.summaryGrid}>
            {summaryItems.map((stat, idx) => (
                <div key={idx} className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>{stat.label}</div>
                    <div className={styles.summaryValue}>{stat.value}</div>
                </div>
            ))}
        </div>
    );
}
