// const express = require("express");
// const router = express.Router();
// const Car = require("../models/car");
// const Review = require("../models/review");
// const { isLoggedIn } = require("../middleware");
// const multer = require("multer");
// const { storage } = require("../utils/cloudinary");
// const upload = multer({ storage });


// // INDEX + SEARCH + FILTERS
// router.get("/", async (req, res) => {
//   const { 
//     search, 
//     minPrice, 
//     maxPrice, 
//     minYear, 
//     maxYear, 
//     fuel, 
//     transmission, 
//     city, 
//     state 
//   } = req.query;

//   // Build query object
//   let query = {};

//   // Search by car name
//   if (search) {
//     query.carName = { $regex: search, $options: "i" };
//   }

//   // Price filter
//   if (minPrice || maxPrice) {
//     query.price = {};
//     if (minPrice) query.price.$gte = Number(minPrice);
//     if (maxPrice) query.price.$lte = Number(maxPrice);
//   }

//   // Year filter
//   if (minYear || maxYear) {
//     query.year = {};
//     if (minYear) query.year.$gte = Number(minYear);
//     if (maxYear) query.year.$lte = Number(maxYear);
//   }

//   // Fuel filter
//   if (fuel) {
//     query.fuel = { $regex: fuel, $options: "i" };
//   }

//   // Transmission filter
//   if (transmission) {
//     query.transmission = { $regex: transmission, $options: "i" };
//   }

//   // City filter
//   if (city) {
//     query.city = { $regex: city, $options: "i" };
//   }

//   // State filter
//   if (state) {
//     query.state = { $regex: state, $options: "i" };
//   }

//   const cars = await Car.find(query);

//   // Get unique values for filter dropdowns
//   const allCars = await Car.find({});
//   const uniqueCities = [...new Set(allCars.map(car => car.city).filter(Boolean))].sort();
//   const uniqueStates = [...new Set(allCars.map(car => car.state).filter(Boolean))].sort();
//   const uniqueFuels = [...new Set(allCars.map(car => car.fuel).filter(Boolean))].sort();
//   const uniqueTransmissions = [...new Set(allCars.map(car => car.transmission).filter(Boolean))].sort();
  
//   // Get min/max values for ranges
//   const prices = allCars.map(car => car.price).filter(price => price && typeof price === 'number');
//   const years = allCars.map(car => car.year).filter(year => year && typeof year === 'number');
//   const minPriceValue = prices.length > 0 ? Math.min(...prices) : 0;
//   const maxPriceValue = prices.length > 0 ? Math.max(...prices) : 10000000;
//   const minYearValue = years.length > 0 ? Math.min(...years) : 2000;
//   const maxYearValue = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

//   res.render("cars/index", { 
//     cars,
//     filters: {
//       search: search || "",
//       minPrice: minPrice || minPriceValue,
//       maxPrice: maxPrice || maxPriceValue,
//       minYear: minYear || minYearValue,
//       maxYear: maxYear || maxYearValue,
//       fuel: fuel || "",
//       transmission: transmission || "",
//       city: city || "",
//       state: state || ""
//     },
//     filterOptions: {
//       cities: uniqueCities,
//       states: uniqueStates,
//       fuels: uniqueFuels,
//       transmissions: uniqueTransmissions,
//       minPriceValue,
//       maxPriceValue,
//       minYearValue,
//       maxYearValue
//     }
//   });
// });


// // NEW (SELL CAR) 🔐 PROTECTED
// router.get("/new", isLoggedIn, (req, res) => {
//   res.render("cars/new");
// });


// // CREATE (SAVE CAR) 🔐 PROTECTED
// router.post("/", isLoggedIn, upload.array("images", 8), async (req, res) => {
//   const carData = req.body.car || {};

//   // Images from uploads
//   let images = [];
//   if (req.files && req.files.length) {
//     images = req.files
//       .map((file) => file.path)
//       .filter((url) => url && url.trim() !== "");
//   }

//   const car = new Car({
//     ...carData,
//     images,
//   });
//   await car.save();
//   res.redirect("/cars");
// });


// // SHOW
// router.get("/:id", async (req, res) => {
//   const car = await Car.findById(req.params.id).populate("reviews");
//   res.render("cars/show", { car });
// });


// // EDIT
// router.get("/:id/edit", async (req, res) => {
//   const car = await Car.findById(req.params.id);
//   res.render("cars/edit", { car });
// });


// // UPDATE
// router.put("/:id", upload.array("images", 8), async (req, res) => {
//   const { id } = req.params;

//   const carData = req.body.car || {};

//   // New uploads, if any
//   let uploadedImages = [];
//   if (req.files && req.files.length) {
//     uploadedImages = req.files
//       .map((file) => file.path)
//       .filter((url) => url && url.trim() !== "");
//   }

//   // Images from textarea (one per line), optional for admin
//   let textImages = [];
//   if (carData.images && typeof carData.images === "string") {
//     textImages = carData.images
//       .split("\n")
//       .map((u) => u.trim())
//       .filter((u) => u);
//   }

//   let images = [...textImages, ...uploadedImages];

//   // Preserve existing images if none provided at all
//   const existingCar = await Car.findById(id);
//   if (!images.length && existingCar) {
//     images =
//       existingCar.images && existingCar.images.length
//         ? existingCar.images
//         : existingCar.image
//         ? [existingCar.image]
//         : [];
//   }

//   await Car.findByIdAndUpdate(id, {
//     ...carData,
//     images,
//   });

//   req.flash("success", "Car updated successfully!");
//   res.redirect(`/cars/${id}`);
// });


// // DELETE
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   await Car.findByIdAndDelete(id);

//   req.flash("success", "Car deleted successfully!");
//   res.redirect("/cars");
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });


// INDEX + SEARCH + FILTERS
router.get("/", async (req, res) => {
  try {
    const { 
      search, 
      minPrice, 
      maxPrice, 
      minYear, 
      maxYear, 
      fuel, 
      transmission, 
      city, 
      state 
    } = req.query;

    let query = {};

    // Search by car name
    if (search && search.trim()) {
      query.carName = { $regex: search.trim(), $options: "i" };
    }

    // Price filter — only if non-empty valid number
    if (minPrice && minPrice.trim() !== "" && !isNaN(minPrice)) {
      query.price = query.price || {};
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice && maxPrice.trim() !== "" && !isNaN(maxPrice)) {
      query.price = query.price || {};
      query.price.$lte = Number(maxPrice);
    }

    // Year filter — only if non-empty valid number
    if (minYear && minYear.trim() !== "" && !isNaN(minYear)) {
      query.year = query.year || {};
      query.year.$gte = Number(minYear);
    }
    if (maxYear && maxYear.trim() !== "" && !isNaN(maxYear)) {
      query.year = query.year || {};
      query.year.$lte = Number(maxYear);
    }

    // Fuel filter
    if (fuel && fuel.trim() !== "") {
      query.fuel = { $regex: fuel.trim(), $options: "i" };
    }

    // Transmission filter
    if (transmission && transmission.trim() !== "") {
      query.transmission = { $regex: transmission.trim(), $options: "i" };
    }

    // City filter
    if (city && city.trim() !== "") {
      query.city = { $regex: city.trim(), $options: "i" };
    }

    // State filter
    if (state && state.trim() !== "") {
      query.state = { $regex: state.trim(), $options: "i" };
    }

    console.log("🔍 Filter query:", JSON.stringify(query));

    const cars = await Car.find(query);

    // Dropdown options from all cars
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
        state:        state        || ""
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


// NEW (SELL CAR) 🔐 PROTECTED
router.get("/new", isLoggedIn, (req, res) => {
  res.render("cars/new");
});


// CREATE (SAVE CAR) 🔐 PROTECTED
router.post("/", isLoggedIn, upload.array("images", 8), async (req, res) => {
  const carData = req.body.car || {};

  let images = [];
  if (req.files && req.files.length) {
    images = req.files
      .map((file) => file.path)
      .filter((url) => url && url.trim() !== "");
  }

  const car = new Car({ ...carData, images });
  await car.save();
  res.redirect("/cars");
});


// SHOW
router.get("/:id", async (req, res) => {
  const car = await Car.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "author" }
  });
  res.render("cars/show", { car });
});


// EDIT
router.get("/:id/edit", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.render("cars/edit", { car });
});


// UPDATE
router.put("/:id", upload.array("images", 8), async (req, res) => {
  const { id } = req.params;
  const carData = req.body.car || {};

  let uploadedImages = [];
  if (req.files && req.files.length) {
    uploadedImages = req.files
      .map((file) => file.path)
      .filter((url) => url && url.trim() !== "");
  }

  let textImages = [];
  if (carData.images && typeof carData.images === "string") {
    textImages = carData.images
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u);
  }

  let images = [...textImages, ...uploadedImages];

  const existingCar = await Car.findById(id);
  if (!images.length && existingCar) {
    images = existingCar.images && existingCar.images.length
      ? existingCar.images
      : existingCar.image ? [existingCar.image] : [];
  }

  await Car.findByIdAndUpdate(id, { ...carData, images });

  req.flash("success", "Car updated successfully!");
  res.redirect(`/cars/${id}`);
});


// DELETE
router.delete("/:id", async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  req.flash("success", "Car deleted successfully!");
  res.redirect("/cars");
});

module.exports = router;