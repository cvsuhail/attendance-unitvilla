import styles from './report.module.css';
import clsx from 'clsx';

interface DailyRecord {
    date: string;
    checkIn: string;
    checkOut: string;
    total: string;
    status: 'Present' | 'Absent' | 'Late';
}

const records: DailyRecord[] = [
    { date: '14 Jan, Wed', checkIn: '09:32 AM', checkOut: '06:12 PM', total: '8.4h', status: 'Present' },
    { date: '13 Jan, Tue', checkIn: '09:45 AM', checkOut: '06:30 PM', total: '8.5h', status: 'Late' },
    { date: '12 Jan, Mon', checkIn: '09:00 AM', checkOut: '06:00 PM', total: '9.0h', status: 'Present' },
    { date: '11 Jan, Sun', checkIn: '-', checkOut: '-', total: '-', status: 'Absent' },
];

export default function DailyList() {
    return (
        <div className={styles.listContainer}>
            <header className={styles.listHeader}>
                <h3 className={styles.listTitle}>Detail History</h3>
                <button className={styles.exportBtn}>Export CSV</button>
            </header>

            <div className={styles.dateGroup}>
                <div className={styles.dateSticky}>Week 2 - Jan 2026</div>
                {records.map((record, idx) => (
                    <div key={idx} className={clsx(styles.attendanceCard, styles[`status${record.status}`])}>
                        <div className={styles.row}>
                            <div className={styles.statusIndicator} />

                            <div className={styles.cardContent}>
                                <div className={styles.row}>
                                    <div className={styles.dateText}>{record.date}</div>
                                    <div className={clsx(styles.statusPill,
                                        record.status === 'Present' ? 'text-green-600' :
                                            record.status === 'Late' ? 'text-amber-500' : 'text-red-500')}
                                        style={{ fontSize: '0.75rem', fontWeight: 600 }}
                                    >
                                        {record.status}
                                    </div>
                                </div>

                                <div className={styles.hoursData}>
                                    <div className={styles.timeRange}>{record.checkIn} - {record.checkOut}</div>
                                    <div className={styles.totalDuration}>{record.total}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
