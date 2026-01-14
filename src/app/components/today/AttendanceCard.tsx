import { Clock, LogIn, LogOut } from 'lucide-react';
import styles from './today.module.css';

interface AttendanceCardProps {
    checkIn: string;
    checkOut: string;
    totalHours: string;
    status: 'Present' | 'Absent' | 'On Leave';
}

export default function AttendanceCard({ checkIn, checkOut, totalHours }: AttendanceCardProps) {
    return (
        <div className={styles.heroCard}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Daily Summary</span>
                <Clock size={20} className="text-indigo-500" style={{ color: 'var(--color-primary)' }} />
            </div>

            <div className={styles.totalHours}>
                <div className={styles.hoursValue}>{totalHours}</div>
                <div className={styles.hoursLabel}>Total Working Hours</div>
            </div>

            <div className={styles.timeGrid}>
                <div className={styles.timeItem}>
                    <div className={styles.timeLabel}>Check In</div>
                    <div className={styles.timeValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogIn size={16} color="var(--color-success)" />
                        {checkIn}
                    </div>
                </div>
                <div className={styles.timeItem}>
                    <div className={styles.timeLabel}>Check Out</div>
                    <div className={styles.timeValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogOut size={16} color="var(--color-warning)" />
                        {checkOut}
                    </div>
                </div>
            </div>
        </div>
    );
}
