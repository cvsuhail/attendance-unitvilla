"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAttendanceData = exports.attendanceWebhook = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
admin.initializeApp();
const db = admin.firestore();
exports.attendanceWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const { secret, event, timestamp } = req.body;
    const userId = req.body.userId ||
        req.body["Device Details"] ||
        req.body.deviceDetails;
    const source = req.body.checkInSource || "webhook";
    // Security check
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ||
        "attendance_secret_123";
    if (secret !== WEBHOOK_SECRET) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const dateObj = new Date(timestamp);
    // Format: "14 Jan 2026 at 12:01 PM"
    const formattedDate = dateObj.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    }).replace(",", " at");
    const dateKey = timestamp.split("T")[0]; // YYYY-MM-DD for doc ID
    const docId = `${userId}_${dateKey}`;
    const ref = db.collection("attendance").doc(docId);
    if (event === "ARRIVE") {
        await ref.set({
            userId,
            date: formattedDate,
            checkIn: formattedDate,
            checkInSource: source,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    if (event === "LEAVE") {
        await ref.set({
            checkOut: formattedDate,
            checkOutSource: source,
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    res.json({ success: true });
});
exports.seedAttendanceData = functions.https.onRequest(async (req, res) => {
    try {
        const userId = "CvSuhail"; // Target user
        const data = [
            { date: "2025-01-01", in: "11:30 AM", out: "6:30 PM" },
            { date: "2025-01-02", in: "10:10 AM", out: "6:00 PM" },
            { date: "2025-01-03", in: "12:30 PM", out: "5:00 PM" },
            { date: "2025-01-05", in: "11:00 AM", out: "6:00 PM" },
            { date: "2025-01-06", in: "10:00 AM", out: "6:00 PM" },
            { date: "2025-01-07", in: "10:00 AM", out: "6:00 PM" },
            { date: "2025-01-08", in: "10:00 AM", out: "6:00 PM" },
            { date: "2025-01-09", in: "10:00 AM", out: "5:15 PM" },
            { date: "2025-01-12", in: "11:00 AM", out: "06:30 pm" },
            { date: "2025-01-13", in: "10:00 AM", out: "06:30 pm" },
        ];
        const batch = db.batch();
        for (const d of data) {
            const docId = `${userId}_${d.date}`;
            const ref = db.collection("attendance").doc(docId);
            // Format: "1 Jan 2025 at 11:30 AM"
            const dateObj = new Date(d.date);
            const dateStr = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            // Helper to normalize AM/PM case
            const formatTimeStr = (timeStr) => {
                const upperTime = timeStr.replace("am", "AM").replace("pm", "PM");
                return `${dateStr} at ${upperTime}`;
            };
            const checkInStr = formatTimeStr(d.in);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateData = {
                userId,
                date: checkInStr,
                checkIn: checkInStr,
                checkInSource: "webhook",
                updatedAt: firestore_1.FieldValue.serverTimestamp(),
            };
            if (d.out) {
                updateData.checkOut = formatTimeStr(d.out);
                updateData.checkOutSource = "webhook";
            }
            batch.set(ref, updateData, { merge: true });
        }
        await batch.commit();
        res.json({ success: true, message: "Seeded Jan 2025 data for CvSuhail" });
    }
    catch (error) {
        console.error("Error seeding data:", error.message, error.stack);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
            stack: error.stack
        });
    }
});
//# sourceMappingURL=index.js.map