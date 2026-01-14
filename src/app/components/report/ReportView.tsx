import MonthSelector from './MonthSelector';
import MonthlySummary from './MonthlySummary';
import DailyList from './DailyList';
import styles from './report.module.css';

export default function ReportView() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Monthly Report</h1>
            </header>

            <MonthSelector />

            <MonthlySummary />

            <DailyList />
        </div>
    );
}
