import { MapPin, Briefcase, LogOut } from 'lucide-react';
import styles from './today.module.css';
import clsx from 'clsx';

interface TimelineEvent {
    id: number;
    title: string;
    time: string;
    type: 'arrived' | 'working' | 'left';
    isActive: boolean;
}

export default function Timeline() {
    const events: TimelineEvent[] = [
        { id: 1, title: 'Office Arrival', time: '09:32 AM', type: 'arrived', isActive: true },
        { id: 2, title: 'Working', time: 'In Progress', type: 'working', isActive: true },
        { id: 3, title: 'Check Out', time: '06:12 PM', type: 'left', isActive: false },
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
