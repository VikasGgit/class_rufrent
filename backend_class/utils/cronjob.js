// const cron = require("node-cron");
// const db = require("../config/db"); // Adjust the path as per your project structure

// function setupNotificationScheduler(io, onlineUsers) {
//     async function sendScheduledNotifications() {
//         try {
//             const [notifications] = await db.execute(`
//                 SELECT dy.Id, dy.User_Id, dy.Notification_Id, dy.CreateTime, dy.c_cnt, dy.LastSentTime, 
//                 st.Type, st.Text, st.Frequency, st.max_counter
//                 FROM dy_notifications dy
//                 JOIN st_notifications st ON dy.Notification_Id = st.id
//                 WHERE dy.c_cnt < st.max_counter AND dy.c_cnt>=0
//             `);

//             const currentTime = new Date();

//             for (const noti of notifications) {
//                 const { Id, User_Id, Notification_Id, CreateTime, c_cnt, LastSentTime, Type, Text, Frequency, max_counter } = noti;

//                 let sendNotification = false;

//                 // Determine last sent time (use LastSentTime if available, else fallback to CreateTime)
//                 const lastSentTime = LastSentTime ? new Date(LastSentTime) : new Date(CreateTime);
//                 const timeDiff = currentTime - lastSentTime;

//                 // Check if it's time to send the next notification based on frequency
//                 switch (Frequency.toLowerCase()) {
//                     case "daily":
//                         sendNotification = timeDiff >=24 * 60 * 60 * 1000; // 24 hours
//                         break;
//                     case "weekly":
//                         sendNotification = timeDiff >=7 * 24 * 60 * 60 * 1000; // 7 days
//                         break;
//                     case "monthly":
//                         sendNotification = timeDiff >= 30 * 24 * 60 * 60 * 1000; // 30 days
//                         break;
//                     case "1": // One-time notification
//                         sendNotification = c_cnt === 0; // Send only if it hasn’t been sent before
//                         break;
//                     default:
//                         console.warn(`⚠️ Unknown frequency: ${Frequency}`);
//                 }

//                 if (sendNotification) {
//                     console.log(`📢 Sending Notification to User ${User_Id}: ${Text}`);

//                     // Emit notification to user in real-time using Socket.IO
//                     const targetSocketId = onlineUsers.get(User_Id.toString());
//                     if (targetSocketId) {
//                         io.of("/notifications").to(targetSocketId).emit("receiveNotification", noti);
//                         console.log(`✅ Notification sent to user ${User_Id}`);
//                     } else {
//                         console.log(`⚠️ User ${User_Id} is offline. Notification saved to database.`);
//                     }

//                     // Update dy_notifications table (increment c_cnt and update LastSentTime)
//                     await db.execute(
//                         `UPDATE dy_notifications SET c_cnt = c_cnt + 1, LastSentTime = NOW() WHERE Id = ?`,
//                         [Id]
//                     );

                    
//                     if (c_cnt + 1 >= max_counter) {
//                         await db.execute(`UPDATE dy_notifications SET c_cnt = -1 WHERE Id = ?`, [Id]);
//                     }
//                 }
//             }

//             console.log("✅ Scheduled Notifications Sent Successfully");
//         } catch (error) {
//             console.error("❌ Error sending notifications:", error.message);
//         }
//     }

//     // Function to delete notifications if they have been read and are older than 12 hours
//     async function deleteOldReadNotifications() {
//         try {
//             const twelveHoursAgo = new Date();
//             twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

//             const [result] = await db.execute(`
//                 DELETE FROM dy_notifications 
//                 WHERE Status = '1' AND c_cnt= -1 AND LastSentTime < ?
//             `, [twelveHoursAgo]); // ✅ Using '<' to delete notifications older than 12 hours

//             console.log(`🗑️ Deleted ${result.affectedRows} old read notifications.`);
//         } catch (error) {
//             console.error("❌ Error deleting old notifications:", error.message);
//         }
//     }
  
//     // Schedule the job to run every minute
//     cron.schedule("* * * * *", sendScheduledNotifications, {
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//     });

//     // Schedule job to delete read notifications every hour
//     cron.schedule("* * * * *", deleteOldReadNotifications, {
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//     });

//     console.log("⏳ Notification Scheduler is Running...");
// }

// module.exports = setupNotificationScheduler;


// const cron = require("node-cron");
// const db = require("../config/db"); // Adjust the path as per your project structure

// function setupNotificationScheduler(io, onlineUsers) {
//     async function sendScheduledNotifications() {
//         try {
//             const [notifications] = await db.execute(`
//                 SELECT dy.Id, dy.User_Id, dy.Notification_Id, dy.CreateTime, dy.c_cnt, dy.LastSentTime, 
//                 st.Type, st.Text, st.Frequency, st.max_counter
//                 FROM dy_notifications dy
//                 JOIN st_notifications st ON dy.Notification_Id = st.id
//                 WHERE dy.c_cnt < st.max_counter AND dy.c_cnt >= 0
//             `);

//             const currentTime = new Date();

//             for (const noti of notifications) {
//                 const { Id, User_Id, Notification_Id, CreateTime, c_cnt, LastSentTime, Type, Text, Frequency, max_counter } = noti;

//                 let sendNotification = false;

//                 // Determine last sent time (use LastSentTime if available, else fallback to CreateTime)
//                 const lastSentTime = LastSentTime ? new Date(LastSentTime) : new Date(CreateTime);
//                 const timeDiff = currentTime - lastSentTime;

//                 // Ensure Frequency exists and is lowercase
//                 const frequency = Frequency ? Frequency.toLowerCase() : "";

//                 // Check if it's time to send the next notification based on frequency
//                 switch (frequency) {
//                     case "daily":
//                         sendNotification = timeDiff >= (24 * 60 * 60 * 1000); // 24 hours
//                         break;
//                     case "weekly":
//                         sendNotification = timeDiff >= (7 * 24 * 60 * 60 * 1000); // 7 days
//                         break;
//                     case "monthly":
//                         sendNotification = timeDiff >= (30 * 24 * 60 * 60 * 1000); // 30 days
//                         break;
//                     case "1": // One-time notification
//                         sendNotification = c_cnt === 0 && !LastSentTime; // Send only if it hasn’t been sent before
//                         break;
//                     default:
//                         console.warn(`⚠️ Unknown frequency: ${Frequency}`);
//                 }

//                 if (sendNotification) {
//                     console.log(`📢 Sending Notification to User ${User_Id}: ${Text}`);

//                     // Update dy_notifications table (increment c_cnt and update LastSentTime before sending)
//                     await db.execute(
//                         `UPDATE dy_notifications SET c_cnt = c_cnt + 1, LastSentTime = NOW() WHERE Id = ?`,
//                         [Id]
//                     );

//                     // If max_counter is reached, set c_cnt to -1
//                     if (c_cnt + 1 >= max_counter) {
//                         await db.execute(`UPDATE dy_notifications SET c_cnt = -1 WHERE Id = ?`, [Id]);
//                         continue; // Skip sending if max_counter is reached
//                     }

//                     // Emit notification to user in real-time using Socket.IO
//                     const targetSocketId = onlineUsers.get(User_Id.toString());
//                     if (targetSocketId) {
//                         io.of("/notifications").to(targetSocketId).emit("receiveNotification", noti);
//                         console.log(`✅ Notification sent to user ${User_Id}`);
//                     } else {
//                         console.log(`⚠️ User ${User_Id} is offline. Notification saved to database.`);
//                     }
//                 }
//             }

//             console.log("✅ Scheduled Notifications Sent Successfully");
//         } catch (error) {
//             console.error("❌ Error sending notifications:", error.message);
//         }
//     }

//     // Function to delete notifications if they have been read and are older than 12 hours
//     async function deleteOldReadNotifications() {
//         try {
//             const twelveHoursAgo = new Date();
//             twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

//             // Convert time to MySQL-compatible format
//             const formattedTime = twelveHoursAgo.toISOString().slice(0, 19).replace("T", " ");

//             const [result] = await db.execute(`
//                 DELETE FROM dy_notifications 
//                 WHERE Status = '1' AND c_cnt = -1 AND LastSentTime < ?
//             `, [formattedTime]); // ✅ Using '<' to delete notifications older than 12 hours

//             console.log(`🗑️ Deleted ${result.affectedRows} old read notifications.`);
//         } catch (error) {
//             console.error("❌ Error deleting old notifications:", error.message);
//         }
//     }

//     // Schedule the job to run every minute
//     cron.schedule("* * * * *", sendScheduledNotifications, {
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//     });

//     // Schedule job to delete read notifications every hour
//     cron.schedule("* * * * *", deleteOldReadNotifications, { // Runs every hour
//         scheduled: true,
//         timezone: "Asia/Kolkata",
//     });

//     console.log("⏳ Notification Scheduler is Running...");
// }

// module.exports = setupNotificationScheduler;



const cron = require("node-cron");
const db = require("../config/db"); // Adjust the path as per your project structure
const DatabaseService = require("../utils/service")
const dbService= new DatabaseService();
function setupNotificationScheduler(io, onlineUsers) {
    async function sendScheduledNotifications() {
        try {
            const tableName = "dy_notifications";
            const columns = `
            
            dy_notifications.Id, 
            dy_notifications.User_Id, 
            dy_notifications.Notification_Id, 
            dy_notifications.CreateTime, 
            dy_notifications.c_cnt, 
            dy_notifications.LastSentTime, 
            st_notifications.Type, 
            st_notifications.Text, 
            st_notifications.Frequency, 
            st_notifications.max_counter
            `;
        const joinClause = "JOIN st_notifications ON dy_notifications.Notification_Id = st_notifications.id";
        const whereClause = "dy_notifications.c_cnt <= st_notifications.max_counter AND dy_notifications.c_cnt >= 0";
        

            const notifications = await dbService.getJoinedData(tableName,  joinClause, columns, whereClause);
            const currentTime = new Date();

            for (const noti of notifications) {
                const { Id, User_Id, Notification_Id, CreateTime, c_cnt, LastSentTime, Type, Text, Frequency, max_counter } = noti;

                let sendNotification = false;
                const lastSentTime = LastSentTime ? new Date(LastSentTime) : new Date(CreateTime);
                const timeDiff = currentTime - lastSentTime;
                const frequency = Frequency ? Frequency.toLowerCase() : "";

                switch (frequency) {
                    case "daily":
                        sendNotification = timeDiff >= 1 // (24 * 60 * 60 * 1000);
                        break;
                    case "weekly":
                        sendNotification = timeDiff >=1// (7 * 24 * 60 * 60 * 1000);
                        break;
                    case "monthly":
                        sendNotification = timeDiff >=1// (30 * 24 * 60 * 60 * 1000);
                        break;
                    case "1":
                        sendNotification = c_cnt === 1;
                        break;
                    default:
                        console.warn(`⚠️ Unknown frequency: ${Frequency}`);
                }

                if (sendNotification) {
                    console.log(`📢 Sending Notification to User ${User_Id}: ${Text}`);

                    await dbService.updateRecord(
                        "dy_notifications",
                        { c_cnt: c_cnt + 1, LastSentTime: new Date() },
                        `Id = ${db.escape(Id)}`
                    );

                    if (c_cnt + 1 >= max_counter) {
                        await dbService.updateRecord(
                            "dy_notifications",
                            { c_cnt: -1 },
                            `Id = ${db.escape(Id)}`
                        );
                        continue;
                    }

                    const targetSocketId = onlineUsers.get(User_Id.toString());
                    if (targetSocketId) {
                        io.of("/notifications").to(targetSocketId).emit("receiveNotification", noti);
                        console.log(`✅ Notification sent to user ${User_Id}`);
                    } else {
                        console.log(`⚠️ User ${User_Id} is offline. Notification saved to database.`);
                    }
                }
            }

            console.log("✅ Scheduled Notifications Sent Successfully");
        } catch (error) {
            console.error("❌ Error sending notifications:", error.message, error);
        }
    }

    async function deleteOldReadNotifications() {
        try {
     const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12); // Subtract 12 hours

        // Manually format the date as 'YYYY-MM-DD HH:mm:ss' (local time)
        const year = twelveHoursAgo.getFullYear();
        const month = String(twelveHoursAgo.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(twelveHoursAgo.getDate()).padStart(2, '0');
        const hours = String(twelveHoursAgo.getHours()).padStart(2, '0');
        const minutes = String(twelveHoursAgo.getMinutes()).padStart(2, '0');
        const seconds = String(twelveHoursAgo.getSeconds()).padStart(2, '0');

        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const deleteCondition = `Status = '1' AND c_cnt = -1 AND LastSentTime < '${formattedTime}'`;
    console.log("deleteCondition", deleteCondition);



           const ress= await dbService.deleteRecord("dy_notifications", deleteCondition);
console.log("ress from the deleting ", ress);
            console.log("🗑️ Deleted old read notifications.");
        } catch (error) {
            console.error("❌ Error deleting old notifications:", error.message);
        }
    }

    cron.schedule("0 0 * * *", sendScheduledNotifications, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    });

    cron.schedule("0 0 * * *", deleteOldReadNotifications, {
        scheduled: true,
        timezone: "Asia/Kolkata",
    });

    console.log("⏳ Notification Scheduler is Running...");
}

module.exports = setupNotificationScheduler;
