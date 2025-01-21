// paymentController.js
// controllers/paymentController.js
const PaymentService = require("../utils/paymentService");

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService(); // Initialize PaymentService
    }

    // Create Order Endpoint
    async createOrder(req, res) {
        try {
            console.log(req.body);
            const { amount, currency, user_id } = req.body;
            const receipt = "receipt_" + new Date().getTime();
            // Call PaymentService to create an order
            const order = await this.paymentService.createOrder({ amount, currency, receipt , user_id});
            
            // Send response back with the order details
            return res.status(200).json({
                success: true,
                message: "Order created successfully",
                order
            });
        } catch (error) {
            console.error("Error in PaymentController.createOrder:", error);
            return res.status(500).json({
                success: false,
                message: "Error creating order",
                error: error.message
            });
        }
    }

    // Verify Payment Endpoint
    async verifyPayment(req, res) {
        try {
            const { razorpay_payment_id, razorpay_order_id, user_id, property_id } = req.body;
            
            // Call PaymentService to verify the payment
            const paymentVerification = await this.paymentService.verifyPayment({
                razorpay_payment_id,
                razorpay_order_id,
                user_id,
                property_id
            });
            
            // Send response back with the verification result
            if (paymentVerification.success) {
                return res.status(200).json({
                    success: true,
                    message: paymentVerification.message,
                    data: paymentVerification.paymentData
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: paymentVerification.message
                });
            }
        } catch (error) {
            console.error("Error in PaymentController.verifyPayment:", error);
            return res.status(500).json({
                success: false,
                message: "Error verifying payment",
                error: error.message
            });
        }
    }
}

module.exports = PaymentController;
