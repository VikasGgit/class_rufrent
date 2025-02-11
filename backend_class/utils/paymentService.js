
const BaseController = require("../utils/baseClass");


class PaymentService extends BaseController {
    constructor() {
        super(); // Call constructor of the BaseController to initialize services
    }


   
    async createOrder({ T_amount, currency, Inv_Id, user_id, notes = {}, expire_by = null }) {
        try {
            const options = {
                amount: Math.round(T_amount * 100), // Convert to paise
                currency,
                notes,  // Optional metadata
                expire_by,  // Optional expiration time
                payment_capture: 1,  // Auto-capture payment
            };
    
            const order = await this.razorpay.orders.create(options);
           
            console.log("Order created:", order);
            return order;
        } catch (error) {
            console.error("Error in PaymentService.createOrder:", error);
            throw new Error(error.message);
        }
    }
    
  
      

    


    async verifyPayment({ razorpay_payment_id, razorpay_order_id, Inv_Id, payment_mode }) {
        console.log("Verifying", Inv_Id);
        try {
            const paymentData = await this.razorpay.payments.fetch(razorpay_payment_id);
            console.log("Saving payment details before verification", paymentData);
    
            const tableName = "dy_payments_info1"; // Corrected table name
            const fieldNames = "Payment_Id, Inv_Id, Payment_Mode, Razor_Pay_Order_Id, Razor_Pay_Payment_ID, Razor_Pay_Payment_DateTime, Payment_Status";
            const fieldValues = [
                paymentData.id,
                Inv_Id,
                payment_mode, // Payment mode (e.g., card, netbanking, UPI)
                paymentData.order_id,
                paymentData.id,
                new Date((paymentData.created_at + 19800) * 1000) // Convert Unix timestamp to MySQL-compatible datetime format
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                paymentData.status
            ];
    
            const insertValues = fieldValues.map(value =>
                typeof value === "string" ? `'${value.replace(/'/g, "\\'")}'` : value
            ).join(", ");
    
            // Save payment details into the database
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
