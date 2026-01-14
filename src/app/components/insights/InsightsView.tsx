import SummaryMetrics from './SummaryMetrics';
import WorkingHoursTrend from './WorkingHoursTrend';
import CheckInBehavior from './CheckInBehavior';
import AttendanceRatio from './AttendanceRatio';
import styles from './insights.module.css';

export default function InsightsView() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Insights</h1>
                <p className={styles.subtitle}>Your attendance patterns this month</p>
            </header>

            <SummaryMetrics />

            <WorkingHoursTrend />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <CheckInBehavior />
                <AttendanceRatio />
            </div>
        </div>
    );
}
