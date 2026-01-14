"use client";

import { useState } from 'react';
import styles from './report.module.css';
import clsx from 'clsx';

const months = [
    'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'
];

export default function MonthSelector() {
    const [selected, setSelected] = useState('Jan 2026');

    return (
        <div className={styles.monthSelector}>
            {months.map((m) => (
                <button
                    key={m}
                    className={clsx(styles.monthChip, selected === m && styles.monthChipActive)}
                    onClick={() => setSelected(m)}
                >
                    {m}
                </button>
            ))}
        </div>
    );
}
