
import { MapPin, Briefcase, LogOut } from 'lucide-react';
import styles from './today.module.css';
import clsx from 'clsx';
import { AttendanceRecord } from '@/lib/firestore-attendance';

interface TimelineEvent {
    id: number;
    title: string;
    time: string;
    type: 'arrived' | 'working' | 'left';
    isActive: boolean;
}

interface TimelineProps {
    attendance?: AttendanceRecord | null;
}

export default function Timeline({ attendance }: TimelineProps) {
    const parseDate = (s: string) => {
        if (!s) return null;
        if (s.includes(" at ")) {
            return new Date(s.replace(" at", ""));
        }
        return new Date(s);
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "--:--";

        // If it's already formatted like "14 Jan 2026 at 12:01 PM", extract time
        if (timeStr.includes(" at ")) {
            const parts = timeStr.split(" at ");
            return parts[1] || timeStr;
        }

        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getWorkingTime = () => {
        if (!attendance?.checkIn) return "-";

        const startDate = parseDate(attendance.checkIn);
        // If date invalid, return text?
        if (!startDate || isNaN(startDate.getTime())) return "In Progress"; // or error

        if (attendance.checkOut) {
            const endDate = parseDate(attendance.checkOut);
            if (!endDate || isNaN(endDate.getTime())) return "In Progress";

            const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            const hours = Math.floor(diff);
            const minutes = Math.round((diff - hours) * 60);
            return `${hours}h ${minutes}m`;
        }
        return "In Progress";
    };

    const hasCheckedIn = !!attendance?.checkIn;
    const hasCheckedOut = !!attendance?.checkOut;

    const events: TimelineEvent[] = [
        {
            id: 1,
            title: 'Office Arrival',
            time: hasCheckedIn ? formatTime(attendance?.checkIn) : '--:--',
            type: 'arrived',
            isActive: hasCheckedIn
        },
        {
            id: 2,
            title: 'Working',
            time: getWorkingTime(),
            type: 'working',
            isActive: hasCheckedIn // Active if checked in (even if checked out, it was active)
        },
        {
            id: 3,
            title: 'Check Out',
            time: hasCheckedOut ? formatTime(attendance?.checkOut) : '--:--',
            type: 'left',
            isActive: hasCheckedOut
        },
    ];

    const getIcon = (type: TimelineEvent['type']) => {
        switch (type) {
            case 'arrived': return <MapPin size={18} />;
            case 'working': return <Briefcase size={18} />;
            case 'left': return <LogOut size={18} />;
        }
    };

    return (
        <div className={styles.timelineContainer}>
            <h3 className={styles.timelineTitle}>Activity Timeline</h3>
            <div className={styles.timeline}>
                {events.map((event) => (
                    <div
                        key={event.id}
                        className={clsx(styles.timelineItem, event.isActive && styles.timelineItemActive)}
                    >
                        <div className={styles.timelineIcon}>
                            {getIcon(event.type)}
                        </div>
                        <div className={styles.timelineContent}>
                            <span className={styles.eventTitle}>{event.title}</span>
                            <span className={styles.eventTime}>{event.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
