const NotificationService = require("../utils/notificationService");

class NotificationController {
  constructor(io, onlineUsers) {
    this.notificationService = new NotificationService(io, onlineUsers);
  }

  // Create "Connect to Manager" notification
  async create_notification(req, res) {
    try {
      const { userId, notificationId } = req.body;

      const notification = await this.notificationService.createNotification(
        userId, notificationId
      );

      res.status(201).json({ message: "Request sent successfully", notification });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to connect to manager" });
    }
  }

  // Get all notifications for a user
  async getNotificationsByTarget(req, res) {
    try {
      const { User_Id } = req.params;
      const notifications = await this.notificationService.getUserNotifications(User_Id);
      res.status(200).json({ message:"data Founds successful", "No. of Records":notifications.length, notifications});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  }

  // Mark a notification as read
  async markNotificationAsRead(req, res) {
    try {
      console.log("Marking notification as read", req.body);
      const { dy_noti_id } = req.body;
      const result = await this.notificationService.markNotificationAsRead(dy_noti_id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  }

  // Get unread notifications for a user
  async getUnreadNotifications(req, res) {
    try {
      const { User_Id } = req.params;
      const notifications = await this.notificationService.getUnreadNotifications(User_Id);
      res.status(200).json({message:"data Founds successful", "No. of Records":notifications.length, notifications});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch unread notifications" });
    }
  }

  // Get read notifications for a user
  async getReadNotifications(req, res) {
    try {
      const { User_Id } = req.params;
      const notifications = await this.notificationService.getReadNotifications(User_Id);
      res.status(200).json({ message:"data Founds successful", "No. of Records":notifications.length, notifications});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch read notifications" });
    }
  }

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(req, res) {
    try {
      const { userId} = req.body;
      const result = await this.notificationService.markAllNotificationsAsRead(userId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  }

  // Mark a specific notification as unread
  async markNotificationAsUnread(req, res) {
    try {
      const { dy_noti_id } = req.body;
      const result = await this.notificationService.markNotificationAsUnread(dy_noti_id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to mark notification as unread" });
    }
  }

  // Delete a notification
  async deleteNotification(req, res) {
    try {
      const { dy_noti_id } = req.body;
      const result = await this.notificationService.deleteNotification(dy_noti_id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  }

  // Get the count of unread notifications for a user
  async getUnreadNotificationCount(req, res) {
    try {
      const { User_Id } = req.params;
      const count = await this.notificationService.getUnreadNotificationCount(User_Id);
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch unread notification count" });
    }
  }
}

module.exports = NotificationController;
