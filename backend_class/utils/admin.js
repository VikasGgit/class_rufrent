const db = require("../config/db"); // Database db
require('dotenv').config();

class AdminManager {
  /**
   * Fetch all table names from the database where the name starts with 'st_'.
   * @returns {Promise<Array>} List of table names.
   */
  async getSTTables() {
    try {
      const query = `
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME LIKE 'st_%';
      `;
      const [rows] = await db.execute(query, [process.env.DB_NAME]);
      return rows.map(row => row.TABLE_NAME);
    } catch (error) {
      console.error('Error fetching st_ tables:', error.message);
      throw error;
    }
  }
  async getDYTables() {
    try {
      const query = `
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME LIKE 'dy_%';
      `;
      const [rows] = await db.execute(query, [process.env.DB_NAME]);
      return rows.map(row => row.TABLE_NAME);
    } catch (error) {
      console.error('Error fetching st_ tables:', error.message);
      throw error;
    }
  }


  /**
   * Fetch all column names for a given table.
   * @param {string} tableName - The name of the table.
   * @returns {Promise<Array>} List of column names.
   */
  async getTableFields(tableName) {
    try {
      const query = `
        SELECT COLUMN_NAME 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;
      `;
      const [rows] = await db.execute(query, [process.env.DB_NAME, tableName]);
      return rows.map(row => row.COLUMN_NAME);
    } catch (error) {
      console.error(`Error fetching fields for table ${tableName}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetch all tables with names starting with 'st_' and their associated fields.
   * @returns {Promise<Array>} List of tables and their fields.
   */
  async getTablesWithFields() {
    try {
      // Step 1: Fetch all tables
      const tables = await this.getSTTables();

      if (!tables || tables.length === 0) {
        return [];
      }

      // Step 2: Fetch fields for each table
      const tablesWithFields = await Promise.all(
        tables.map(async (tableName) => {
          const fields = await this.getTableFields(tableName);
          return { tableName, fields };
        })
      );

      return tablesWithFields;
    } catch (error) {
      console.error('Error fetching tables and their fields:', error.message);
      throw error;
    }
  }
  async getDyTablesWithFields() {
    try {
      // Step 1: Fetch all tables
      const tables = await this.getDYTables();

      if (!tables || tables.length === 0) {
        return [];
      }

      // Step 2: Fetch fields for each table
      const tablesWithFields = await Promise.all(
        tables.map(async (tableName) => {
          const fields = await this.getTableFields(tableName);
          return { tableName, fields };
        })
      );

      return tablesWithFields;
    } catch (error) {
      console.error('Error fetching tables and their fields:', error.message);
      throw error;
    }
  }
}

module.exports = AdminManager;
