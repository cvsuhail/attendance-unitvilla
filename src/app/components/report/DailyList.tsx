import styles from './report.module.css';
import clsx from 'clsx';

export interface DailyRecord {
    date: string;       // e.g. "14 Jan, Wed"
    checkIn: string;
    checkOut: string;
    total: string;
    status: 'Present' | 'Absent' | 'Late';
}

export default function DailyList({ records }: { records: DailyRecord[] }) {
    return (
        <div className={styles.listContainer}>
            <header className={styles.listHeader}>
                <h3 className={styles.listTitle}>Detail History</h3>
                <button className={styles.exportBtn}>Export CSV</button>
            </header>

            <div className={styles.dateGroup}>
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
