const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const razorpayInstance = require("../utils/razorpayInstance");
const crypto = require("crypto");

const asyncHandler = require("../utils/AsyncHandler");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

const createPayment = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  console.log(req.body);
  const { orderId, totalAmount, paymentStatus, paymentMethod } = req.body;

  if (!orderId || !totalAmount || !paymentStatus || !paymentMethod) {
    throw new ApiError(402, "All fields are required.");
  }

  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const razorpay = await razorpayInstance.orders.create(options);

  const payment = await Payment.create({
    order_id: orderId,
    user_id: loggedIn?._id,
    amount: totalAmount,
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    razorpay_id: razorpay?.id,
    transaction_id: razorpay.or,
  });

  const savedPayment = await Payment.findById({ _id: payment?._id });

  if (!savedPayment) {
    throw new ApiError(402, "Payment creation failed.");
  }

  await Order.updateOne({ _id: orderId }, { $set: { payment_staus: "PAID" } });
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { razorpay, savedPayment },
        "Payment created successfully."
      )
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const payment = await Payment.findOne({ order_id: orderId });
    if (!payment) {
      throw new ApiError(403, "Payment not found");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.PAY_SECRET)
      .update(orderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      payment.payment_staus = "FAILED";
      payment.error_details = "Invalid payment signature";
      await Order.findByIdAndUpdate(
        { _id: payment.order_id },
        {
          $set: { payment_staus: "FAILED" },
        }
      );

      await payment.save();
      throw new ApiError(400, "Invalid payment signature");
    }

    payment.payment_staus = "PAID";
    payment.razorpay_signature = razorpaySignature;
    payment.transaction_id = razorpayPaymentId;
    await Order.findByIdAndUpdate(
      { _id: payment.order_id },
      {
        $set: { payment_staus: "PAID" },
      }
    );
    await payment.save();

    res.status(200).json(ApiResponse(200, {}, "Payment verified successfully"));
  } catch (error) {
    throw new ApiError(403, "Error verifying payment");
  }
});

const webHookPayment = asyncHandler(async (req, res) => {
  try {
    const secret = process.env.KEY_SECRET;
    const receivedSignature = req.headers["x-razorpay-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      throw new ApiError(400, "Invalid webhook signature");
    }

    const { event, payload } = req.body;

    const orderId = payload.payment.entity.order_id;
    const method = payload?.payment?.entity?.method || "";

    // Find the payment record in the database
    const payment = await Payment.findOne({ transaction_id: orderId });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    switch (event) {
      case "payment.captured":
        payment.payment_staus = "PAID";
        payment.payment_method = method;
        payment.transaction_id = payload.payment.entity.id || "";
        await Order.findByIdAndUpdate(
          { _id: payment.order_id },
          {
            $set: { payment_staus: "PAID" },
          }
        );
        break;

      case "payment.failed":
        payment.payment_staus = "FAILED";
        payment.payment_method = method;
        payment.transaction_id = payload?.payment?.entity?.id || "";
        payment.error_details =
          payload.payment.entity?.error_description || "Unknown error";

        await Order.findByIdAndUpdate(
          { _id: payment.order_id },
          {
            $set: { payment_staus: "FAILED" },
          }
        );
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    await payment.save();
    res.status(200).json(ApiResponse(200, {}, "Webhook handled successfully"));
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw new ApiError(400, "Webhook not processes.");
  }
});

 

const getPayment = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const id = req?.body?.id || req?.params?.id;

  if (!id) {
    throw new ApiError(402, "Payment id is missing.");
  }

  const payment = await Payment.findById({ _id: id });

  if (!payment) {
    throw new ApiError(402, "Payment not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, payment, "Payment found successfully."));
});

const getAllPayment = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const payments = await Payment.find({ user_id: loggedIn._id });

  if (!payments) {
    throw new ApiError(402, "Payments not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, payments, "Payments found successfully."));
});

const deletePayment = asyncHandler(async (req, res) => {
  const loggedIn = req.user;

  if (!loggedIn) {
    throw new ApiError(404, "Unauthorized request.");
  }

  const id = req?.body?.id || req?.params?.id;
  if (!id) {
    throw new ApiError(402, "Order id is missing.");
  }

  const isExistOrder = await Order.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        order_status: "CANCELLED",
        cancelledAt: new Date(),
      },
    }
  );

  if (!isExistOrder) {
    throw new ApiError(402, "Order not found.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Order cancelled successfully."));
});

module.exports = {
  createPayment,
  getPayment,
  getAllPayment,
  deletePayment,
  verifyPayment,
  webHookPayment,
};

// {
//     "event": "payment.captured",
//     "payload": {
//       "payment": {
//         "entity": {
//           "id": "pay_29QQoUBi66xm2f",
//           "order_id": "order_9A33XWu170gUtm",
//           "amount": 5000,
//           "status": "captured",
//           "method": "card",
//           "description": "Payment for Order #1234",
//           "card": {
//             "id": "card_9A33XWu170gUtm",
//             "network": "Visa",
//             "type": "debit",
//             "last4": "1234",
//             "issuer": "HDFC",
//             "international": false
//           }
//         }
//       }
//     }
//   }
