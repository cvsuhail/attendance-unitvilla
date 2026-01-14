"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceWebhook = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
exports.attendanceWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const { secret, userId, event, timestamp } = req.body;
    // Security check
    if (secret !== process.env.WEBHOOK_SECRET) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const date = timestamp.split("T")[0];
    const docId = `${userId}_${date}`;
    const ref = db.collection("attendance").doc(docId);
    if (event === "ARRIVE") {
        await ref.set({
            userId,
            date,
            checkIn: timestamp,
            checkInSource: "webhook",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    if (event === "LEAVE") {
        await ref.set({
            checkOut: timestamp,
            checkOutSource: "webhook",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    res.json({ success: true });
});
//# sourceMappingURL=index.js.map