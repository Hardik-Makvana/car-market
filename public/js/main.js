/**
 * main.js
 * Handles all client-side interactions for RideHub
 */

document.addEventListener("DOMContentLoaded", () => {
  // ================= AUTO SEARCH =================
  const searchInput = document.getElementById("searchInput");
  if (searchInput && window.location.pathname === "/cars") {
    let timer;
    searchInput.addEventListener("input", function (e) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Submit the form associated with the input
        if (e.target.form) e.target.form.submit();
      }, 600);
    });
  }

  // ================= HERO MOUSE ANIMATION =================
  const title = document.getElementById("heroTitle");
  const car = document.getElementById("heroCar");
  const btn = document.getElementById("heroBtn");

  if (title || car || btn) {
    document.addEventListener("mousemove", (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 25;
      const y = (window.innerHeight / 2 - e.clientY) / 25;

      if (title) title.style.transform = `translate(${x}px, ${y}px)`;
      if (car) car.style.transform = `translate(${x * -1}px, ${y * -1}px)`;
      if (btn) btn.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ================= SERVICE MODAL SCRIPT =================
  const serviceDetails = {
    "car-selling": {
      title: "Car Selling",
      content:
        "Sell your car quickly with verified buyers, best market price, and complete paperwork support.",
    },
    "parts-repair": {
      title: "Parts Repair",
      content:
        "Certified mechanics and 200+ service centers across India for reliable repairs.",
    },
    insurance: {
      title: "Car Insurance",
      content:
        "Lowest premium insurance with instant policy issuance and claim assistance.",
    },
    battery: {
      title: "Battery Replacement",
      content:
        "Doorstep battery replacement with warranty-backed genuine products.",
    },
    oil: {
      title: "Oil Change",
      content:
        "Premium oil change services to improve engine life and performance.",
    },
    support: {
      title: "24/7 Support",
      content: "Round-the-clock assistance for buying, selling, and servicing cars.",
    },
  };

  const modal = document.getElementById("serviceModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");

  if (modal) {
    document.querySelectorAll(".service-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.service;
        if (serviceDetails[key]) {
          modalTitle.innerText = serviceDetails[key].title;
          modalContent.innerText = serviceDetails[key].content;
          modal.classList.add("active");
        }
      });
    });

    const modalCloseBtn = document.querySelector(".modal-close");
    if (modalCloseBtn) {
      modalCloseBtn.onclick = () => {
        modal.classList.remove("active");
      };
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  // ================= CAR GALLERY (SHOW PAGE) =================
  const path = window.location.pathname;
  const isCarShowPage =
    path.startsWith("/cars/") &&
    !path.endsWith("/edit") &&
    path.split("/").length === 3; // /cars/:id

  if (isCarShowPage) {
    const gallery = document.querySelector("[data-gallery]");
    if (gallery) {
      const images = Array.from(gallery.querySelectorAll(".car-gallery-img"));
      const thumbs = Array.from(gallery.querySelectorAll(".car-gallery-thumb"));
      const prevBtn = gallery.querySelector("[data-gallery-prev]");
      const nextBtn = gallery.querySelector("[data-gallery-next]");

      let currentIndex = 0;

      const showImage = (index) => {
        if (!images.length) return;
        currentIndex = (index + images.length) % images.length;

        images.forEach((img, i) => {
          img.classList.toggle("active", i === currentIndex);
        });
        thumbs.forEach((thumb, i) => {
          thumb.classList.toggle("active", i === currentIndex);
        });
      };

      if (prevBtn) {
        prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
      }

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const idx = Number(thumb.dataset.thumbIndex || 0);
          showImage(idx);
        });
      });
    }
  }

  // ================= IMAGE LIGHTBOX LOGIC =================
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalClose = document.querySelector(".image-modal-close");

  if (imageModal && modalImage) {
    // Open Modal on Gallery Image Click
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("car-gallery-img") ||
        e.target.classList.contains("card-img-top")
      ) {
        imageModal.classList.add("active");
        modalImage.src = e.target.src;
        document.body.style.overflow = "hidden"; // Prevent scrolling
      }
    });

    // Close Modal
    const closeModal = () => {
      imageModal.classList.remove("active");
      modalImage.classList.remove("zoomed");
      modalImage.style.transform = ""; // Reset zoom
      document.body.style.overflow = "";
    };

    if (modalClose) modalClose.addEventListener("click", closeModal);

    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) closeModal();
    });

    // Zoom Functionality
    modalImage.addEventListener("click", (e) => {
      const isZoomed = modalImage.classList.contains("zoomed");

      if (isZoomed) {
        modalImage.classList.remove("zoomed");
        modalImage.style.transform = "";
      } else {
        modalImage.classList.add("zoomed");
      }
      e.stopPropagation(); // Prevent closing modal
    });

    modalImage.addEventListener("mousemove", (e) => {
      if (modalImage.classList.contains("zoomed")) {
        const { left, top, width, height } = modalImage.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        modalImage.style.transformOrigin = `${x}% ${y}%`;
      }
    });
  }

  // ================= FILTER FUNCTIONALITY (INDEX PAGE) =================
  const filterForm = document.getElementById("filterForm");
  
  // Only run logic if the filter form exists on the page
  if (filterForm) {
    // Filter Accordion Functionality
    // Filter Accordion Functionality
    const accordionHeaders = document.querySelectorAll(".filter-accordion-header");

    accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const accordion = header.closest(".filter-accordion");
        accordion.classList.toggle("active");
      });
    });

    // Prevent closing when clicking inside content
    document.querySelectorAll(".filter-accordion-content").forEach(content => {
      content.addEventListener("click", (e) => e.stopPropagation());
    });

    const filterSidebar = document.querySelector(".filter-sidebar");
    const filterToggleBtn = document.getElementById("filterToggleBtn");
    const filterToggle = document.getElementById("filterToggle");
    const filterOverlay = document.getElementById("filterOverlay");

    // Toggle filter sidebar (Mobile)
    if (filterToggleBtn && filterSidebar) {
      filterToggleBtn.addEventListener("click", () => {
        filterSidebar.classList.add("active");
        if (filterOverlay) filterOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    // Close filter sidebar
    const closeSidebar = () => {
      filterSidebar.classList.remove("active");
      if (filterOverlay) filterOverlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (filterToggle) filterToggle.addEventListener("click", closeSidebar);
    if (filterOverlay) filterOverlay.addEventListener("click", closeSidebar);

    // Format number inputs (prevent invalid chars)
    const numberInputs = document.querySelectorAll('.range-inputs input[type="number"]');
    numberInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });
    });

    // Prevent form submission with empty values & Clean URL
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Stop default submission to clean data

      const formData = new FormData(filterForm);
      const params = new URLSearchParams();

      // Only add non-empty values
      for (const [key, value] of formData.entries()) {
        if (value && value.trim() !== "") {
          params.append(key, value.trim());
        }
      }

      // Build URL and navigate
      // Use window.location.pathname ensures we stay on /cars even if on /cars/something else by mistake (though this query is for index)
      const url = "/cars" + (params.toString() ? "?" + params.toString() : "");
      window.location.href = url;
    });
  }
});
