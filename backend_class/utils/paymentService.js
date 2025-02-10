// services/paymentService.js
const BaseController = require("../utils/baseClass");


class PaymentService extends BaseController {
    constructor() {
        super(); // Call constructor of the BaseController to initialize services
    }


    async createOrder({ amount, currency, receipt, user_id }) {
        try {
            const options = {
                amount: Math.round(amount * 100), // Convert to paisa (integer value)
                currency,
                receipt,
            };
    
            const order = await this.razorpay.orders.create(options);
            const tableName = "dy_orders_history"; // Change this to your actual table name
    
            const fieldNames = "order_id, user_id, amount, time";
            const id=order.id;
            console.log("id", id);
            const date = new Date((order.created_at + 19800) * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "); // Format as 'YYYY-MM-DD HH:MM:SS'
            const amt=Number((Number(order.amount) / 100).toFixed(2))
            // Correct SQL insert format
            const insertValues = `'${order.id}', ${user_id}, ${amt}, '${date}'`; 
        
            console.log("fieldNames", fieldNames);
            console.log("inserted values", insertValues);
    
            await this.dbService.addNewRecord(tableName, fieldNames, insertValues);
    
            console.log("Order created in PaymentService", order);
            return order;
        } catch (error) {
            console.error("Error in PaymentService.createOrder:", error);
            throw new Error(error.message);
        }
    }
    

  
      

    // Method to verify the payment status
    async verifyPayment({ razorpay_payment_id, razorpay_order_id, user_id, property_id }) {
        try {
            const paymentData = await this.razorpay.payments.fetch(razorpay_payment_id);
            console.log("Saving payment details before verification", paymentData);

            const tableName = "dy_payments_info"; // Change this to your actual table name
            const fieldNames = "user_id, property_id, payment_id, order_id, amount, currency, status, payment_data, created_at";
            const fieldValues = [
                user_id,
                property_id,
                razorpay_payment_id,
                razorpay_order_id,
                Number((Number(paymentData.amount) / 100).toFixed(2)), 
                paymentData.currency,
                paymentData.status,
                JSON.stringify(paymentData), // Store JSON as a string
                new Date((paymentData.created_at + 19800) * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
     // Convert Unix timestamp to MySQL-compatible datetime format
            ];
            const insertValues = fieldValues.map(value => 
              typeof value === "string" ? `'${value.replace(/'/g, "\\'")}'` : value
            ).join(", ");
            
    
            // Save payment details using stored procedure
            await this.dbService.addNewRecord(tableName, fieldNames, insertValues);
    

            // Validate payment status and order ID
            if (paymentData.status === "captured" && paymentData.order_id === razorpay_order_id) {
                return { success: true, message: "Payment verified successfully", paymentData };
            } else {
                return { success: false, message: "Invalid payment or order mismatch" };
            }
        } catch (error) {
            console.error("Error in PaymentService.verifyPayment:", error);
            throw new Error(error.message);
        }
    }
}

module.exports = PaymentService;
