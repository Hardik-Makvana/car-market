const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  // ── Core ──────────────────────────────────
  carName:      { type: String, required: true },
  price:        { type: Number, required: true },
  negotiable:   { type: Boolean, default: false },
  urgentSale:   { type: Boolean, default: false },

  // ── Location ─────────────────────────────
  city:         String,
  state:        String,

  // ── Basic specs ──────────────────────────
  year:         Number,
  fuel:         String,           // Petrol / Diesel / CNG / Electric / Hybrid
  transmission: String,           // Manual / Automatic / CVT / AMT
  mileage:      Number,           // km driven

  // ── Vehicle details ───────────────────────
  color:        String,
  seats:        Number,           // 2 / 4 / 5 / 7 / 8
  engineCC:     Number,           // Engine capacity in cc
  powerBHP:     Number,           // Power in bhp (optional)

  // ── Ownership & registration ──────────────
  ownership:        String,       // First / Second / Third / Fourth+
  registrationCity: String,
  registrationYear: Number,

  // ── Condition ────────────────────────────
  condition:        String,       // Excellent / Good / Fair
  accidentHistory:  { type: Boolean, default: false },
  serviceHistory:   String,       // Available / Not Available

  // ── Insurance ────────────────────────────
  insuranceStatus:  String,       // Active / Expired
  insuranceValidTill: String,     // "MM/YYYY"

  // ── Seller ───────────────────────────────
  sellerType:   String,           // Individual / Dealer
  dealerName:   { type: String, required: true },
  dealerPhone:  { type: String, required: true },

  // ── Availability ─────────────────────────
  availability: String,           // Immediate / Within 1 week / Negotiable

  // ── Features (checkboxes) ─────────────────
  features: {
    ac:              { type: Boolean, default: false },
    powerSteering:   { type: Boolean, default: false },
    powerWindows:    { type: Boolean, default: false },
    abs:             { type: Boolean, default: false },
    airbags:         { type: Boolean, default: false },
    sunroof:         { type: Boolean, default: false },
    touchscreen:     { type: Boolean, default: false },
    reverseCamera:   { type: Boolean, default: false },
    alloyWheels:     { type: Boolean, default: false },
    bluetooth:       { type: Boolean, default: false },
    cruiseControl:   { type: Boolean, default: false },
    keylessEntry:    { type: Boolean, default: false },
  },

  // ── Media ─────────────────────────────────
  image:        { type: String, default: "" },   // legacy
  images:       { type: [String], default: [] },

  // ── Description ───────────────────────────
  description:  String,

  // ── Relations ─────────────────────────────
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);