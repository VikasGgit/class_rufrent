const cron = require("node-cron");
const db = require("../config/db"); // Adjust the path as per your project structure

function setupNotificationScheduler(io, onlineUsers) {
    async function sendScheduledNotifications() {
        try {
            const [notifications] = await db.execute(`
                SELECT dy.Id, dy.User_Id, dy.Notification_Id, dy.CreateTime, dy.c_cnt, dy.LastSentTime, 
                st.Type, st.Text, st.Frequency, st.max_counter
                FROM dy_notifications dy
                JOIN st_notifications st ON dy.Notification_Id = st.id
                WHERE dy.c_cnt < st.max_counter
            `);

            const currentTime = new Date();

            for (const noti of notifications) {
                const { Id, User_Id, Notification_Id, CreateTime, c_cnt, LastSentTime, Type, Text, Frequency, max_counter } = noti;

                let sendNotification = false;

                // Determine last sent time (use LastSentTime if available, else fallback to CreateTime)
                const lastSentTime = LastSentTime ? new Date(LastSentTime) : new Date(CreateTime);
                const timeDiff = currentTime - lastSentTime;

                // Check if it's time to send the next notification based on frequency
                switch (Frequency.toLowerCase()) {
                    case "daily":
                        sendNotification = timeDiff >=1 //24 * 60 * 60 * 1000; // 24 hours
                        break;
                    case "weekly":
                        sendNotification = timeDiff >=1 //7 * 24 * 60 * 60 * 1000; // 7 days
                        break;
                    case "monthly":
                        sendNotification = timeDiff >= 1//30 * 24 * 60 * 60 * 1000; // 30 days
                        break;
                    case "1": // One-time notification
                        sendNotification = c_cnt === 0; // Send only if it hasn’t been sent before
                        break;
                    default:
                        console.warn(`⚠️ Unknown frequency: ${Frequency}`);
                }

                if (sendNotification) {
                    console.log(`📢 Sending Notification to User ${User_Id}: ${Text}`);

                    // Emit notification to user in real-time using Socket.IO
                    const targetSocketId = onlineUsers.get(User_Id.toString());
                    if (targetSocketId) {
                        io.of("/notifications").to(targetSocketId).emit("receiveNotification", noti);
                        console.log(`✅ Notification sent to user ${User_Id}`);
                    } else {
                        console.log(`⚠️ User ${User_Id} is offline. Notification saved to database.`);
                    }

                    // Update dy_notifications table (increment c_cnt and update LastSentTime)
                    await db.execute(
                        `UPDATE dy_notifications SET c_cnt = c_cnt + 1, LastSentTime = NOW() WHERE Id = ?`,
                        [Id]
                    );

                    // If max_counter is reached, mark as read
                    // if (c_cnt + 1 >= max_counter) {
                    //     await db.execute(`UPDATE dy_notifications SET Status = 'read' WHERE Id = ?`, [Id]);
                    // }
                }
            }

            console.log("✅ Scheduled Notifications Sent Successfully");
        } catch (error) {
            console.error("❌ Error sending notifications:", error.message);
        }
    }

    // Function to delete notifications if they have been read and are older than 12 hours
    async function deleteOldReadNotifications() {
        try {
            const twelveHoursAgo = new Date();
            twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

            const [result] = await db.execute(`
                DELETE FROM dy_notifications 
                WHERE Status = 'read' AND LastSentTime < ?
            `, [twelveHoursAgo]); // ✅ Using '<' to delete notifications older than 12 hours

            console.log(`🗑️ Deleted ${result.affectedRows} old read notifications.`);
        } catch (error) {
            console.error("❌ Error deleting old notifications:", error.message);
        }
    }
  
    // Schedule the job to run every minute
    cron.schedule("0 0 * * *", sendScheduledNotifications, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    });

    // Schedule job to delete read notifications every hour
    cron.schedule("0 0 * * *", deleteOldReadNotifications, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    });

    console.log("⏳ Notification Scheduler is Running...");
}

module.exports = setupNotificationScheduler;
