const DatabaseService = require("../utils/service");
const AdminManager = require("../utils/admin");
const RazorpayService = require("../config/razor"); // Already initialized singleton
const db = require("../config/db");

class BaseController {
    constructor() {
        this.dbService = new DatabaseService();
        this.tableManager = new AdminManager();
        this.db=db;
        this.razorpay = RazorpayService.getInstance(); // Use Singleton Instance
    }
}

module.exports = BaseController;
