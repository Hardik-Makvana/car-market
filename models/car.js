const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: String,
  state: String,
  year: Number,
  fuel: String,
  transmission: String,
  mileage: Number,

  // Legacy single image field (kept for backwards compatibility)
  image: {
    type: String,
    default: "",
  },

  // New multiple images field
  images: {
    type: [String],
    default: [],
  },

  description: String,

  dealerName: {
    type: String,
    required: true,
  },
  dealerPhone: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Car", carSchema);
