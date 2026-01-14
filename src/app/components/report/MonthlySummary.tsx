import styles from './report.module.css';

export default function MonthlySummary() {
    const stats = [
        { label: 'Working Days', value: '22' },
        { label: 'Total Hours', value: '184.5' },
        { label: 'Leaves Taken', value: '1' },
        { label: 'Late Days', value: '2' },
    ];

    return (
        <div className={styles.summaryGrid}>
            {stats.map((stat, idx) => (
                <div key={idx} className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>{stat.label}</div>
                    <div className={styles.summaryValue}>{stat.value}</div>
                </div>
            ))}
        </div>
    );
}
