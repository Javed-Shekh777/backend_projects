const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User id is required."],
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "Product id is required."],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required."],
          min: [1, "Quantity must be at least 1."],
        },
        price: {
          type: Number,
          required: [true, "Price is required."],
          min: [0, "Price must be greater than or equal to 0."],
        },

      },
    ],
  },
  { timestamps: true }
);

cartSchema.virtual("total_price").get(function () {
  return this.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
});

module.exports = mongoose.model("cart", cartSchema);



// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: [true, "User id is required."],
//     },
//     products: [
//       {
//         product_id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "product",
//           required: [true, "Product id is required."],
//         },
//         quantity: {
//           type: Number,
//           required: [true, "Quantity is required."],
//           min: [1, "Quantity must be at least 1."]
//         },
//         price: {
//           type: Number,
//           required: [true, "Price is required."],
//           min: [0, "Price must be greater than or equal to 0."]
//         },
//         name: { type: String },  // Optional product name field
//         image: { type: String }  // Optional product image field
//       },
//     ],
//     expiresAt: {
//       type: Date,
//       default: Date.now() + 30 * 60 * 1000 // 30 minutes
//     }
//   },
//   { timestamps: true }
// );

// // Virtual to calculate total cart price
// cartSchema.virtual('total_price').get(function () {
//   return this.products.reduce((total, product) => total + product.price * product.quantity, 0);
// });

// // Method to update product quantity in cart
// cartSchema.methods.updateProductQuantity = function (productId, newQuantity) {
//   const product = this.products.find(p => p.product_id.toString() === productId.toString());
//   if (product) {
//     product.quantity = newQuantity;
//   }
//   return this.save();
// };

// // Method to remove product from cart
// cartSchema.methods.removeProduct = function (productId) {
//   this.products = this.products.filter(p => p.product_id.toString() !== productId.toString());
//   return this.save();
// };

// module.exports = mongoose.model("Cart", cartSchema);
