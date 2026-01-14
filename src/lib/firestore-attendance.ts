import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the interface for our attendance data
export interface AttendanceRecord {
    date: string;       // YYYY-MM-DD
    checkIn?: string;   // ISO timestamp
    checkOut?: string;  // ISO timestamp
    checkInSource?: string;
    checkOutSource?: string;
    userId: string;
}

export async function getTodayAttendance(userId: string = "employee_001") {
    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "attendance", `${userId}_${today}`);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;
    return snap.data() as AttendanceRecord;
}

export async function getMonthlyAttendance(month: string, userId: string = "employee_001") {
    // month format: YYYY-MM
    const q = query(
        collection(db, "attendance"),
        where("userId", "==", userId),
        where("date", ">=", `${month}-01`),
        where("date", "<=", `${month}-31`)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AttendanceRecord);
}


export function subscribeToDailyAttendance(userId: string = "employee_001", date: Date | string = new Date(), callback: (data: AttendanceRecord | null) => void) {
    let dateStr: string;
    if (typeof date === 'string') {
        const d = new Date(date);
        dateStr = d.toISOString().split("T")[0];
    } else {
        dateStr = date.toISOString().split("T")[0];
    }

    // Adjust for timezone offset if needed to match "Today" in local time
    // If input is "2025-01-01" string, it's fine. 
    // If input is Date object, toISOString() is UTC.
    // Ideally we use a string 'YYYY-MM-DD' directly or handle timezone. 
    // For now, let's assume the caller passes a correct Date or YYYY-MM-DD string.

    // Better handling: if date is Date, format to YYYY-MM-DD local or specific...
    // The previous code used new Date().toISOString().split("T")[0] which is UTC today.
    // Use local date string construction to avoid UTC issues if the user is in +5:30.

    if (date instanceof Date) {
        // Create YYYY-MM-DD in local time (or just rely on the input being correct)
        // Simple hack for now:
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        dateStr = localDate.toISOString().split("T")[0];
    }

    const docRef = doc(db, "attendance", `${userId}_${dateStr}`);

    const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
            callback(snap.data() as AttendanceRecord);
        } else {
            callback(null);
        }
    });

    return unsubscribe;
}
