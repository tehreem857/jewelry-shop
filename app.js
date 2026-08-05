// Default inventory data
const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Blush Pearl Ring",
    category: "rings",
    price: 120.00,
    description: "A delicate band handcrafted in solid 14k gold, showcasing a hand-selected blush pink freshwater pearl with a soft, warm luster. Perfectly minimal and elegant on its own or stacked with other fine bands.",
    image: "images/pearl_ring.png"
  },
  {
    id: "p2",
    name: "Rose Gold Blossom Earrings",
    category: "earrings",
    price: 95.00,
    description: "Delicately sculpted flower petals crafted in 14k rose gold fill. These elegant studs feature a textured satin finish that catches light softly, adding a subtle touch of feminine grace.",
    image: "images/blossom_earrings.png"
  },
  {
    id: "p3",
    name: "Aura Quartz Pendant",
    category: "necklaces",
    price: 140.00,
    description: "A raw, double-terminated aura quartz crystal suspended on a shimmering, ultra-fine 18k gold-filled chain. The crystal reflects soft, ethereal blush and cream hues with movement.",
    image: "images/quartz_pendant.png"
  },
  {
    id: "p4",
    name: "Cream Enamel Bracelet",
    category: "bracelets",
    price: 110.00,
    description: "A modern, minimalist bangle featuring a hand-applied soft cream enamel inlay channel on polished gold fill. Features a secure, invisible hinge and pressure clasp for a clean, sleek profile.",
    image: "images/enamel_bracelet.png"
  },
  {
    id: "p5",
    name: "Sunlit Opal Studs",
    category: "earrings",
    price: 85.00,
    description: "Small, minimalist 14k yellow gold studs featuring round, hand-cut white opals. These dainty earrings exhibit subtle flashes of fiery pink and gold in different lighting.",
    image: "images/opal_studs.png"
  },
  {
    id: "p6",
    name: "Luxe Nude Choker",
    category: "necklaces",
    price: 75.00,
    description: "A soft, premium nude-blush colored silk ribbon collar featuring a dainty hand-hammered 14k gold leaf charm. Adjustable length tie-back closure for a perfect, elegant fit.",
    image: "images/nude_choker.png"
  }
];

// App State
let state = {
  products: [],
  cart: [],
  orders: [], // Holds order records placed by customers
  activeFilter: "all",
  activeView: "shop-view",
  editingProductId: null,
  activeManagerTab: "inventory" // Tracks whether Inventory or Orders is active
};

// DOM Elements
const elements = {
  // Navigation & Headers
  logoLink: document.getElementById("logo-link"),
  navShop: document.getElementById("nav-shop"),
  navManager: document.getElementById("nav-manager"),
  cartToggleBtn: document.getElementById("cart-toggle-btn"),
  cartCount: document.getElementById("cart-count"),
  
  // Views
  shopView: document.getElementById("shop-view"),
  checkoutView: document.getElementById("checkout-view"),
  orderSuccessView: document.getElementById("order-success-view"),
  managerView: document.getElementById("manager-view"),
  
  // Shop View Elements
  filterContainer: document.getElementById("filter-container"),
  productsGrid: document.getElementById("products-grid"),
  
  // Cart Drawer Elements
  cartDrawer: document.getElementById("cart-drawer"),
  cartDrawerOverlay: document.getElementById("cart-drawer-overlay"),
  cartDrawerClose: document.getElementById("cart-drawer-close"),
  cartItemsContainer: document.getElementById("cart-items-container"),
  cartSubtotal: document.getElementById("cart-subtotal"),
  btnCartCheckout: document.getElementById("btn-cart-checkout"),
  
  // Product Detail Modal
  productModalOverlay: document.getElementById("product-modal-overlay"),
  productModalClose: document.getElementById("product-modal-close"),
  productModalContent: document.getElementById("product-modal-content"),
  
  // Checkout View Elements
  checkoutForm: document.getElementById("checkout-form"),
  checkoutSummaryList: document.getElementById("checkout-summary-list"),
  checkoutTotalPrice: document.getElementById("checkout-total-price"),
  btnBackToShop: document.getElementById("btn-back-to-shop"),
  customerEmail: document.getElementById("customer-email"),
  customerPhone: document.getElementById("customer-phone"),
  
  // Order Success View Elements
  orderSuccessTicket: document.getElementById("order-success-ticket"),
  btnSuccessContinue: document.getElementById("btn-success-continue"),
  
  // Product Manager View Elements
  productForm: document.getElementById("product-form"),
  productIdField: document.getElementById("product-id-field"),
  productNameField: document.getElementById("product-name-field"),
  productCategoryField: document.getElementById("product-category-field"),
  productPriceField: document.getElementById("product-price-field"),
  productDescField: document.getElementById("product-desc-field"),
  productImageInput: document.getElementById("product-image-input"),
  productImageData: document.getElementById("product-image-data"),
  imageUploadWidget: document.getElementById("image-upload-widget"),
  imagePreview: document.getElementById("image-preview"),
  uploadWidgetText: document.getElementById("upload-widget-text"),
  uploadOverlayText: document.getElementById("upload-overlay-text"),
  btnCancelEdit: document.getElementById("btn-cancel-edit"),
  btnSubmitProduct: document.getElementById("btn-submit-product"),
  managerFormTitle: document.getElementById("manager-form-title"),
  btnResetDefaults: document.getElementById("btn-reset-defaults"),
  managerList: document.getElementById("manager-list"),
  
  // Manager Sub-Tabs and Panels
  tabInventory: document.getElementById("tab-inventory"),
  tabOrders: document.getElementById("tab-orders"),
  managerInventoryPanel: document.getElementById("manager-inventory-panel"),
  managerOrdersPanel: document.getElementById("manager-orders-panel"),
  ordersReceivedList: document.getElementById("orders-received-list"),
  btnClearOrders: document.getElementById("btn-clear-orders")
};

// Initialize Application
function init() {
  loadState();
  setupEventListeners();
  renderProducts();
  renderInventoryList();
  renderCart();
}

// Load state from localStorage or defaults
function loadState() {
  // Load products
  const savedProducts = localStorage.getItem("jewelry_shop_products");
  if (savedProducts) {
    try {
      state.products = JSON.parse(savedProducts);
    } catch (e) {
      console.error("Error parsing saved products", e);
      state.products = [...DEFAULT_PRODUCTS];
    }
  } else {
    state.products = [...DEFAULT_PRODUCTS];
    localStorage.setItem("jewelry_shop_products", JSON.stringify(state.products));
  }

  // Load cart
  const savedCart = localStorage.getItem("jewelry_shop_cart");
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
    } catch (e) {
      console.error("Error parsing saved cart", e);
      state.cart = [];
    }
  } else {
    state.cart = [];
  }

  // Load orders
  const savedOrders = localStorage.getItem("jewelry_shop_orders");
  if (savedOrders) {
    try {
      state.orders = JSON.parse(savedOrders);
    } catch (e) {
      console.error("Error parsing saved orders", e);
      state.orders = [];
    }
  } else {
    state.orders = [];
  }
}

// Save state to localStorage
function saveProducts() {
  localStorage.setItem("jewelry_shop_products", JSON.stringify(state.products));
}

function saveCart() {
  localStorage.setItem("jewelry_shop_cart", JSON.stringify(state.cart));
}

function saveOrders() {
  localStorage.setItem("jewelry_shop_orders", JSON.stringify(state.orders));
}

// Reset everything to defaults
function resetToDefaults() {
  if (confirm("Are you sure you want to reset the store to its default inventory? This will delete all custom products and edits.")) {
    state.products = [...DEFAULT_PRODUCTS];
    saveProducts();
    
    // Clear cart since default items could have shifted IDs/references
    state.cart = [];
    saveCart();
    
    // Reset view
    switchView("shop-view");
    
    // Refresh UI
    renderProducts();
    renderInventoryList();
    renderCart();
    
    // Reset form
    resetManagerForm();
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // View switches
  elements.logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("shop-view");
  });
  
  elements.navShop.addEventListener("click", () => switchView("shop-view"));
  elements.navManager.addEventListener("click", () => switchView("manager-view"));
  
  // Cart toggle drawer
  elements.cartToggleBtn.addEventListener("click", () => toggleCart(true));
  elements.cartDrawerClose.addEventListener("click", () => toggleCart(false));
  elements.cartDrawerOverlay.addEventListener("click", () => toggleCart(false));
  
  // Modal close
  elements.productModalClose.addEventListener("click", closeModal);
  elements.productModalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.productModalOverlay) closeModal();
  });
  
  // Filter buttons
  elements.filterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // Remove active class from all filters
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
      // Add to clicked filter
      e.target.classList.add("active");
      
      state.activeFilter = e.target.dataset.category;
      renderProducts();
    }
  });
  
  // Cart checkout button
  elements.btnCartCheckout.addEventListener("click", () => {
    toggleCart(false);
    switchView("checkout-view");
  });
  
  // Checkout view transitions
  elements.btnBackToShop.addEventListener("click", () => switchView("shop-view"));
  elements.checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  
  // Success page continue
  elements.btnSuccessContinue.addEventListener("click", () => {
    switchView("shop-view");
  });
  
  // Reset products list
  elements.btnResetDefaults.addEventListener("click", resetToDefaults);
  
  // Manager Image Upload logic
  elements.imageUploadWidget.addEventListener("click", () => {
    elements.productImageInput.click();
  });
  
  elements.imageUploadWidget.addEventListener("dragover", (e) => {
    e.preventDefault();
    elements.imageUploadWidget.style.borderColor = "var(--color-accent)";
  });
  
  elements.imageUploadWidget.addEventListener("dragleave", () => {
    elements.imageUploadWidget.style.borderColor = "var(--color-border)";
  });
  
  elements.imageUploadWidget.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.imageUploadWidget.style.borderColor = "var(--color-border)";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processAndPreviewImage(files[0]);
    }
  });
  
  elements.productImageInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processAndPreviewImage(e.target.files[0]);
    }
  });
  
  // Manager Form submission
  elements.productForm.addEventListener("submit", handleProductFormSubmit);
  elements.btnCancelEdit.addEventListener("click", resetManagerForm);
  
  // Manager Sub-Tabs switching
  elements.tabInventory.addEventListener("click", () => switchManagerTab("inventory"));
  elements.tabOrders.addEventListener("click", () => switchManagerTab("orders"));
  elements.btnClearOrders.addEventListener("click", clearOrdersList);
}

// Switch between SPA Views
function switchView(viewId) {
  state.activeView = viewId;
  
  // Update view visibility
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });
  
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
  }
  
  // Update header links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.dataset.view === viewId) {
      link.classList.add("active");
    }
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
  
  // Special view updates
  if (viewId === "checkout-view") {
    renderCheckoutSummary();
  }
}

// Open/Close Cart Drawer
function toggleCart(isOpen) {
  if (isOpen) {
    elements.cartDrawer.classList.add("active");
    elements.cartDrawerOverlay.classList.add("active");
    renderCart(); // Refresh cart items when opening
  } else {
    elements.cartDrawer.classList.remove("active");
    elements.cartDrawerOverlay.classList.remove("active");
  }
}

// Image downscaling and file reading helper
function processAndPreviewImage(file) {
  if (!file.type.match("image.*")) {
    alert("Please select an image file.");
    return;
  }
  
  // Read and compress
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      
      const maxDimension = 500; // Keep image dimension small for localStorage
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75); // 75% quality JPEG
      
      // Update hidden field and preview
      elements.productImageData.value = compressedDataUrl;
      elements.imagePreview.src = compressedDataUrl;
      elements.imagePreview.classList.add("active");
      elements.uploadWidgetText.style.display = "none";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Render Products Grid on Shop View
function renderProducts() {
  elements.productsGrid.innerHTML = "";
  
  const filtered = state.products.filter(p => {
    return state.activeFilter === "all" || p.category === state.activeFilter;
  });
  
  if (filtered.length === 0) {
    elements.productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 80px 0;">
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    card.innerHTML = `
      <div class="product-img-wrapper" data-id="${product.id}">
        <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name" data-id="${product.id}">${product.name}</h3>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn-add-cart" data-id="${product.id}">Add to Bag</button>
        </div>
      </div>
    `;
    
    // Add Click listener to open detail modal
    card.querySelectorAll(".product-img-wrapper, .product-name").forEach(el => {
      el.addEventListener("click", () => openProductModal(product.id));
    });
    
    // Add Click listener for add-to-bag
    card.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id);
    });
    
    elements.productsGrid.appendChild(card);
  });
}

// Detail Modal
function openProductModal(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  elements.productModalContent.innerHTML = `
    <div class="modal-img-wrapper">
      <img class="modal-img" src="${product.image}" alt="${product.name}">
    </div>
    <div class="modal-content">
      <span class="modal-category">${product.category}</span>
      <h2 class="modal-name">${product.name}</h2>
      <span class="modal-price">$${product.price.toFixed(2)}</span>
      <p class="modal-description">${product.description}</p>
      <div class="modal-actions">
        <button class="btn-primary" id="btn-modal-add-cart">Add to Shopping Bag</button>
      </div>
    </div>
  `;
  
  document.getElementById("btn-modal-add-cart").addEventListener("click", () => {
    addToCart(product.id);
    closeModal();
  });
  
  elements.productModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
}

function closeModal() {
  elements.productModalOverlay.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable scroll
}

// Cart System Operations
function addToCart(productId) {
  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ productId, quantity: 1 });
  }
  
  saveCart();
  renderCart();
  
  // Small micro-animation feedback on cart badge
  elements.cartToggleBtn.style.transform = "scale(1.15)";
  setTimeout(() => {
    elements.cartToggleBtn.style.transform = "";
  }, 150);
}

function updateCartQuantity(productId, delta) {
  const itemIndex = state.cart.findIndex(item => item.productId === productId);
  if (itemIndex > -1) {
    state.cart[itemIndex].quantity += delta;
    
    if (state.cart[itemIndex].quantity <= 0) {
      state.cart.splice(itemIndex, 1);
    }
    
    saveCart();
    renderCart();
    
    // If we're currently looking at the checkout view, keep checkout summary synced too
    if (state.activeView === "checkout-view") {
      renderCheckoutSummary();
    }
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.productId !== productId);
  saveCart();
  renderCart();
  
  if (state.activeView === "checkout-view") {
    renderCheckoutSummary();
  }
}

// Render Cart Drawer Contents
function renderCart() {
  // Update badge count
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartCount.textContent = totalCount;
  
  elements.cartItemsContainer.innerHTML = "";
  
  if (state.cart.length === 0) {
    elements.cartItemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your bag is empty</p>
      </div>
    `;
    elements.cartSubtotal.textContent = "$0.00";
    elements.btnCartCheckout.disabled = true;
    elements.btnCartCheckout.style.opacity = "0.5";
    elements.btnCartCheckout.style.cursor = "not-allowed";
    return;
  }
  
  elements.btnCartCheckout.disabled = false;
  elements.btnCartCheckout.style.opacity = "1";
  elements.btnCartCheckout.style.cursor = "pointer";
  
  let subtotal = 0;
  
  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.productId);
    if (!product) return; // In case product was deleted
    
    const itemPrice = product.price * item.quantity;
    subtotal += itemPrice;
    
    const row = document.createElement("div");
    row.className = "cart-item";
    
    row.innerHTML = `
      <div class="cart-item-img-wrapper">
        <img class="cart-item-img" src="${product.image}" alt="${product.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-name">${product.name}</h4>
        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="quantity-btn dec" data-id="${product.id}">−</button>
            <span class="quantity-val">${item.quantity}</span>
            <button class="quantity-btn inc" data-id="${product.id}">+</button>
          </div>
          <button class="btn-remove-item" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    
    row.querySelector(".quantity-btn.dec").addEventListener("click", () => updateCartQuantity(product.id, -1));
    row.querySelector(".quantity-btn.inc").addEventListener("click", () => updateCartQuantity(product.id, 1));
    row.querySelector(".btn-remove-item").addEventListener("click", () => removeFromCart(product.id));
    
    elements.cartItemsContainer.appendChild(row);
  });
  
  elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Render Checkout Order Summary Panel
function renderCheckoutSummary() {
  elements.checkoutSummaryList.innerHTML = "";
  let total = 0;
  
  if (state.cart.length === 0) {
    elements.checkoutSummaryList.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.9rem;">No items in cart. <a href="#" id="checkout-shop-redirect" style="color: var(--color-accent); text-decoration: underline;">Return to shop</a></p>`;
    elements.checkoutTotalPrice.textContent = "$0.00";
    
    document.getElementById("checkout-shop-redirect")?.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("shop-view");
    });
    return;
  }
  
  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.productId);
    if (!product) return;
    
    const cost = product.price * item.quantity;
    total += cost;
    
    const row = document.createElement("div");
    row.className = "checkout-summary-item";
    row.innerHTML = `
      <span class="checkout-summary-name">${product.name} <strong style="font-weight: normal; color: var(--color-text-muted);">x ${item.quantity}</strong></span>
      <span class="checkout-summary-price">$${cost.toFixed(2)}</span>
    `;
    elements.checkoutSummaryList.appendChild(row);
  });
  
  elements.checkoutTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// ─── Order Server Endpoint ──────────────────────────────────────────────────
// Your own Node.js backend (server.js) running on the same machine.
// It sends emails directly via your Gmail SMTP — no 3rd party needed.
const ORDER_SERVER_URL = "http://localhost:3001/send-order";
// ─────────────────────────────────────────────────────────────────────────────

// Handle Order Placement
function handleCheckoutSubmit(e) {
  e.preventDefault();

  if (state.cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // ── Read form values ──────────────────────────────────────────────────────
  const name    = document.getElementById("customer-name").value.trim();
  const email   = document.getElementById("customer-email").value.trim();
  const phone   = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const notes   = document.getElementById("order-notes").value.trim();

  // ── Strict validations ────────────────────────────────────────────────────
  if (!name) {
    showFieldError("customer-name", "Please enter your full name.");
    return;
  }
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
    showFieldError("customer-email", "Only Gmail addresses accepted (e.g. name@gmail.com).");
    return;
  }
  const phoneClean = phone.replace(/[\s\-().]/g, "");
  if (!phoneClean || !/^(\+92|92|0)?3\d{9}$|^\+?[0-9]{10,14}$/.test(phoneClean)) {
    showFieldError("customer-phone", "Enter a valid phone number e.g. 03369197296.");
    return;
  }
  if (!address) {
    showFieldError("customer-address", "Please enter your delivery address.");
    return;
  }

  // ── Calculate totals ──────────────────────────────────────────────────────
  let total = 0;
  const itemsBreakdown = state.cart.map(item => {
    const p = state.products.find(p => p.id === item.productId);
    const itemTotal = p ? p.price * item.quantity : 0;
    total += itemTotal;
    return { name: p ? p.name : "Unknown Item", quantity: item.quantity, total: itemTotal };
  });

  const orderId   = "AR-" + Math.floor(10000 + Math.random() * 90000);
  const orderDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const itemsSummaryText = itemsBreakdown.map(i => `• ${i.name} (x${i.quantity}) — $${i.total.toFixed(2)}`).join("\n");

  // ── Save to local on-site orders database ─────────────────────────────────
  state.orders.push({ orderId, orderDate, name, email, phone: phoneClean, address, notes, total, itemsSummary: itemsSummaryText });
  saveOrders();

  // ── Render receipt ticket ─────────────────────────────────────────────────
  const itemsHtml = itemsBreakdown.map(i => `
    <div class="ticket-row">
      <span class="ticket-label">${i.name} × ${i.quantity}</span>
      <span class="ticket-val">$${i.total.toFixed(2)}</span>
    </div>`).join("");

  elements.orderSuccessTicket.innerHTML = `
    <div class="ticket-header">
      <span class="ticket-id">ORDER ID: ${orderId}</span>
      <span class="ticket-date">${orderDate}</span>
    </div>
    <div class="ticket-row"><span class="ticket-label">Customer:</span><span class="ticket-val" style="font-weight:600;">${name}</span></div>
    <div class="ticket-row"><span class="ticket-label">Gmail:</span><span class="ticket-val">${email}</span></div>
    <div class="ticket-row"><span class="ticket-label">Phone:</span><span class="ticket-val">${phoneClean}</span></div>
    <div class="ticket-row"><span class="ticket-label">Address:</span><span class="ticket-val" style="text-align:right;max-width:60%;word-break:break-word;">${address}</span></div>
    ${notes ? `<div class="ticket-row"><span class="ticket-label">Notes:</span><span class="ticket-val" style="font-style:italic;">${notes}</span></div>` : ""}
    <div style="border-top:1px dashed var(--color-border);margin:15px 0;"></div>
    ${itemsHtml}
    <div class="ticket-row total"><span class="ticket-label">Total Amount:</span><span class="ticket-val">$${total.toFixed(2)}</span></div>
  `;

  // ── Clear cart, reset form, show success immediately ──────────────────────
  state.cart = [];
  saveCart();
  renderCart();
  elements.checkoutForm.reset();
  switchView("order-success-view");

  // ── WhatsApp: open in NEW TAB so user stays on success screen ────────────
  const waMsg =
    `🌸 *New Order — AURÉLIE Studio*\n` +
    `──────────────────────────\n` +
    `*Order ID:* ${orderId}\n*Date:* ${orderDate}\n\n` +
    `*Customer Details:*\n` +
    `• Name: ${name}\n• Gmail: ${email}\n• Phone: ${phoneClean}\n• Address: ${address}` +
    (notes ? `\n• Notes: ${notes}` : "") +
    `\n\n*Items Ordered:*\n${itemsSummaryText}\n\n` +
    `*Total Amount: $${total.toFixed(2)}*\n` +
    `──────────────────────────`;

  window.open(`https://wa.me/923369197296?text=${encodeURIComponent(waMsg)}`, "_blank");

  // ── POST order to your own Node.js backend → sends real emails via Gmail SMTP ──
  fetch(ORDER_SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id:         orderId,
      order_date:       orderDate,
      customer_name:    name,
      customer_email:   email,
      customer_phone:   phoneClean,
      delivery_address: address,
      special_notes:    notes || "None",
      items_summary:    itemsSummaryText,
      total_amount:     `$${total.toFixed(2)}`
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("✅ Order emails sent via your own server.");
    } else {
      console.warn("⚠️ Server responded but email may have failed:", data.message);
    }
  })
  .catch(() => {
    console.warn("⚠️ Could not reach order server (is server.js running?). WhatsApp notification was still sent.");
  });
}

// Product Manager: Render Inventory List
function renderInventoryList() {
  elements.managerList.innerHTML = "";
  
  if (state.products.length === 0) {
    elements.managerList.innerHTML = `
      <div style="text-align: center; color: var(--color-text-muted); padding: 40px 0;">
        No products in inventory.
      </div>
    `;
    return;
  }
  
  state.products.forEach(product => {
    const row = document.createElement("div");
    row.className = "manager-list-item";
    row.innerHTML = `
      <div class="manager-list-info">
        <img class="manager-list-img" src="${product.image}" alt="${product.name}">
        <div class="manager-list-details">
          <span class="manager-list-name">${product.name}</span>
          <span class="manager-list-meta">${product.category} • $${product.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="manager-list-actions">
        <button class="btn-icon edit" data-id="${product.id}" title="Edit product information">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-icon delete" data-id="${product.id}" title="Delete product">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    
    // Wire actions
    row.querySelector(".btn-icon.edit").addEventListener("click", () => editProductSetup(product.id));
    row.querySelector(".btn-icon.delete").addEventListener("click", () => deleteProduct(product.id));
    
    elements.managerList.appendChild(row);
  });
}

// Product Manager: Edit product loader
function editProductSetup(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  state.editingProductId = productId;
  
  // Fill form
  elements.productIdField.value = product.id;
  elements.productNameField.value = product.name;
  elements.productCategoryField.value = product.category;
  elements.productPriceField.value = product.price;
  elements.productDescField.value = product.description;
  
  // Set image preview
  elements.productImageData.value = product.image;
  elements.imagePreview.src = product.image;
  elements.imagePreview.classList.add("active");
  elements.uploadWidgetText.style.display = "none";
  
  // Adjust headers and actions
  elements.managerFormTitle.textContent = "Edit Jewelry Piece";
  elements.btnSubmitProduct.textContent = "Save Changes";
  elements.btnCancelEdit.style.display = "inline-block";
  
  // Scroll to form (especially on mobile)
  elements.productForm.scrollIntoView({ behavior: "smooth" });
}

// Product Manager: Reset form
function resetManagerForm() {
  state.editingProductId = null;
  
  elements.productForm.reset();
  elements.productIdField.value = "";
  elements.productImageData.value = "";
  elements.imagePreview.src = "";
  elements.imagePreview.classList.remove("active");
  elements.uploadWidgetText.style.display = "block";
  
  elements.managerFormTitle.textContent = "Add New Jewelry";
  elements.btnSubmitProduct.textContent = "Save Jewelry";
  elements.btnCancelEdit.style.display = "none";
}

// Product Manager: Delete Product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to remove this jewelry piece from inventory?")) {
    state.products = state.products.filter(p => p.id !== productId);
    saveProducts();
    
    // Also remove from cart if present
    state.cart = state.cart.filter(item => item.productId !== productId);
    saveCart();
    
    renderProducts();
    renderInventoryList();
    renderCart();
    
    if (state.editingProductId === productId) {
      resetManagerForm();
    }
  }
}

// Product Manager: Add/Edit Submit Handler
function handleProductFormSubmit(e) {
  e.preventDefault();
  
  const id = elements.productIdField.value;
  const name = elements.productNameField.value.trim();
  const category = elements.productCategoryField.value;
  const price = parseFloat(elements.productPriceField.value);
  const description = elements.productDescField.value.trim();
  const image = elements.productImageData.value;
  
  if (!image) {
    alert("Please upload a product photo.");
    return;
  }
  
  if (id) {
    // Edit existing product
    const index = state.products.findIndex(p => p.id === id);
    if (index > -1) {
      state.products[index] = { id, name, category, price, description, image };
    }
  } else {
    // Add new product
    const newId = "p_" + Date.now();
    state.products.push({ id: newId, name, category, price, description, image });
  }
  
  saveProducts();
  renderProducts();
  renderInventoryList();
  resetManagerForm();
  
  // Micro feedback
  alert("Product saved successfully.");
}

// Manager Sub-Tabs Switching
function switchManagerTab(tabId) {
  state.activeManagerTab = tabId;
  
  if (tabId === "inventory") {
    elements.tabInventory.classList.add("active");
    elements.tabOrders.classList.remove("active");
    elements.managerInventoryPanel.style.display = "grid";
    elements.managerOrdersPanel.style.display = "none";
  } else {
    elements.tabOrders.classList.add("active");
    elements.tabInventory.classList.remove("active");
    elements.managerInventoryPanel.style.display = "none";
    elements.managerOrdersPanel.style.display = "grid";
    renderOrdersReceivedList();
  }
}

// Render Orders List inside the Manager Tab
function renderOrdersReceivedList() {
  elements.ordersReceivedList.innerHTML = "";
  
  if (state.orders.length === 0) {
    elements.ordersReceivedList.innerHTML = `
      <div style="text-align: center; color: var(--color-text-muted); padding: 50px 0;">
        No orders received yet.
      </div>
    `;
    return;
  }
  
  state.orders.forEach(order => {
    const row = document.createElement("div");
    row.className = "manager-list-item";
    row.style.flexDirection = "column";
    row.style.alignItems = "stretch";
    row.style.gap = "15px";
    row.style.padding = "20px";
    row.style.borderBottom = "1px solid var(--color-border)";
    
    // Format list details
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1rem; border-bottom: 1px solid var(--color-bg-base); padding-bottom: 8px;">
        <span>Order ID: ${order.orderId}</span>
        <span style="font-family: var(--font-heading); color: var(--color-accent-hover);">$${order.total.toFixed(2)}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--color-text-muted); display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
        <div><strong>Customer:</strong> ${order.name}</div>
        <div><strong>Gmail:</strong> ${order.email}</div>
        <div><strong>Phone:</strong> ${order.phone}</div>
        <div><strong>Date:</strong> ${order.orderDate}</div>
        <div style="grid-column: 1/-1;"><strong>Address:</strong> ${order.address}</div>
        ${order.notes ? `<div style="grid-column: 1/-1;"><strong>Notes:</strong> <em>${order.notes}</em></div>` : ""}
      </div>
      <div style="font-size: 0.85rem; border-top: 1px dashed var(--color-border); padding-top: 8px;">
        <strong>Items Ordered:</strong>
        <div style="margin-top: 5px; color: var(--color-text-muted); white-space: pre-line;">
          ${order.itemsSummary}
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
        <button class="btn-icon delete btn-delete-order" data-id="${order.orderId}" title="Delete this order record" style="width: auto; padding: 0 12px; height: 32px; font-size: 0.75rem; display: flex; align-items: center; gap: 5px; border-color: var(--color-danger); border-radius: 6px;">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 12px; height: 12px; stroke: var(--color-danger); fill: none; stroke-width: 2;">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Delete Record
        </button>
      </div>
    `;
    
    row.querySelector(".btn-delete-order").addEventListener("click", () => deleteOrderRecord(order.orderId));
    elements.ordersReceivedList.appendChild(row);
  });
}

// Delete individual order log
function deleteOrderRecord(orderId) {
  if (confirm(`Are you sure you want to delete order record ${orderId}?`)) {
    state.orders = state.orders.filter(order => order.orderId !== orderId);
    saveOrders();
    renderOrdersReceivedList();
  }
}

// Clear all order logs
function clearOrdersList() {
  if (confirm("Are you sure you want to clear all order logs from the site database? This cannot be undone.")) {
    state.orders = [];
    saveOrders();
    renderOrdersReceivedList();
  }
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
