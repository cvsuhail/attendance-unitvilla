import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getTodayAttendance() {
    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "attendance", `employee_001_${today}`);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;
    return snap.data();
}

export async function getMonthlyAttendance(month: string) {
    const q = query(
        collection(db, "attendance"),
        where("date", ">=", `${month}-01`),
        where("date", "<=", `${month}-31`)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
}
