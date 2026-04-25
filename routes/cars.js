const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });


// ══ INDEX + SEARCH + FILTERS + SORT ══════════════════════════
router.get("/", async (req, res) => {
  try {
    const {
      search,
      minPrice, maxPrice,
      minYear,  maxYear,
      fuel, transmission,
      city, state,
      sort
    } = req.query;

    let query = {};

    if (search && search.trim())
      query.carName = { $regex: search.trim(), $options: "i" };

    if (minPrice && !isNaN(minPrice))
      query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice && !isNaN(maxPrice))
      query.price = { ...query.price, $lte: Number(maxPrice) };

    if (minYear && !isNaN(minYear))
      query.year = { ...query.year, $gte: Number(minYear) };
    if (maxYear && !isNaN(maxYear))
      query.year = { ...query.year, $lte: Number(maxYear) };

    if (fuel && fuel.trim())
      query.fuel = { $regex: fuel.trim(), $options: "i" };
    if (transmission && transmission.trim())
      query.transmission = { $regex: transmission.trim(), $options: "i" };
    if (city && city.trim())
      query.city = { $regex: city.trim(), $options: "i" };
    if (state && state.trim())
      query.state = { $regex: state.trim(), $options: "i" };

    // ── Sort ──────────────────────────────────────────
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "price-asc")  sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "year-desc")  sortOption = { year: -1 };
    if (sort === "km-asc")     sortOption = { mileage: 1 };

    const cars = await Car.find(query).sort(sortOption);

    // Dropdown options from ALL cars (ignore active filters)
    const allCars = await Car.find({});
    const uniqueCities        = [...new Set(allCars.map(c => c.city).filter(Boolean))].sort();
    const uniqueStates        = [...new Set(allCars.map(c => c.state).filter(Boolean))].sort();
    const uniqueFuels         = [...new Set(allCars.map(c => c.fuel).filter(Boolean))].sort();
    const uniqueTransmissions = [...new Set(allCars.map(c => c.transmission).filter(Boolean))].sort();

    res.render("cars/index", {
      cars,
      filters: {
        search:       search       || "",
        minPrice:     minPrice     || "",
        maxPrice:     maxPrice     || "",
        minYear:      minYear      || "",
        maxYear:      maxYear      || "",
        fuel:         fuel         || "",
        transmission: transmission || "",
        city:         city         || "",
        state:        state        || "",
        sort:         sort         || "newest",
      },
      filterOptions: {
        cities:        uniqueCities,
        states:        uniqueStates,
        fuels:         uniqueFuels,
        transmissions: uniqueTransmissions,
      }
    });

  } catch (err) {
    console.error("❌ Filter error:", err);
    res.status(500).send("Something went wrong: " + err.message);
  }
});


// ══ NEW (SELL CAR) — protected ════════════════════════════════
router.get("/new", isLoggedIn, (req, res) => {
  res.render("cars/new");
});


// ══ CREATE — protected ════════════════════════════════════════
// router.post("/", isLoggedIn, upload.array("images", 8), async (req, res) => {
//   const carData = req.body.car || {};
//   let images = [];
//   if (req.files && req.files.length)
//     images = req.files.map(f => f.path).filter(Boolean);

//   const car = new Car({ ...carData, images });
//   await car.save();
//   req.flash("success", "Your car is now listed!");
//   res.redirect("/cars");
// });

router.post("/", isLoggedIn, upload.array("images", 8), async (req, res) => {
  const carData = req.body.car || {};

  // ✅ FIX BOOLEAN FIELDS
  carData.accidentHistory = carData.accidentHistory === "true";

  // (optional for safety)
  carData.negotiable = carData.negotiable === "true";
  carData.urgentSale = carData.urgentSale === "true";

  let images = [];
  if (req.files && req.files.length)
    images = req.files.map(f => f.path).filter(Boolean);

  const car = new Car({ ...carData, images });
  await car.save();

  req.flash("success", "Your car is now listed!");
  res.redirect("/cars");
});


// ══ SHOW ══════════════════════════════════════════════════════
router.get("/:id", async (req, res) => {
  const car = await Car.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "author" }
  });
  if (!car) {
    req.flash("error", "Car not found.");
    return res.redirect("/cars");
  }
  res.render("cars/show", { car });
});


// ══ EDIT ══════════════════════════════════════════════════════
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) { req.flash("error", "Car not found."); return res.redirect("/cars"); }
  res.render("cars/edit", { car });
});


// ══ UPDATE ════════════════════════════════════════════════════
router.put("/:id", isLoggedIn, upload.array("images", 8), async (req, res) => {
  const { id } = req.params;
  const carData = req.body.car || {};

  let uploadedImages = req.files && req.files.length
    ? req.files.map(f => f.path).filter(Boolean)
    : [];

  let textImages = carData.images && typeof carData.images === "string"
    ? carData.images.split("\n").map(u => u.trim()).filter(Boolean)
    : [];

  let images = [...textImages, ...uploadedImages];

  // Fall back to existing images if no new ones provided
  if (!images.length) {
    const existing = await Car.findById(id);
    images = existing?.images?.length
      ? existing.images
      : existing?.image ? [existing.image] : [];
  }

  await Car.findByIdAndUpdate(id, { ...carData, images });
  req.flash("success", "Car updated successfully!");
  res.redirect(`/cars/${id}`);
});


// ══ DELETE ════════════════════════════════════════════════════
router.delete("/:id", isLoggedIn, async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted.");
  res.redirect("/cars");
});

module.exports = router;