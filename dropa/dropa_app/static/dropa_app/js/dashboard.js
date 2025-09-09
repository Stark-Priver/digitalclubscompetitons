// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
});

function initializeDashboard() {
  // Check if we're on a page that needs dashboard functionality
  const isDashboardPage = document.body.classList.contains('dashboard-page') || 
                         document.querySelector('.dashboard-container') ||
                         window.location.pathname.includes('dashboard');
  
  // Always setup common functionality
  setupSidebar();
  setupHeader();
  setupNotifications();
  setupModals();
  setupSearch();
  
  // Only load dashboard-specific data if we're on a dashboard page
  if (isDashboardPage || document.getElementById('totalPackages')) {
    loadDashboardData();
    initializeCharts();
  }
  
  // Initialize map if map container exists
  if (document.getElementById('deliveryMap')) {
    initializeMap();
  }
  
  setupRealTimeUpdates();
}

// Sidebar functionality
function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileToggle = document.getElementById("mobileToggle");
  const overlay = document.getElementById("overlay");

  sidebarToggle?.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    localStorage.setItem(
      "sidebarCollapsed",
      sidebar.classList.contains("collapsed")
    );
  });

  mobileToggle?.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("show");
  });

  overlay?.addEventListener("click", function () {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
    closeAllDropdowns();
  });

  // Restore sidebar state
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    sidebar.classList.add("collapsed");
  }
}

// Header functionality
function setupHeader() {
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userDropdown = document.getElementById("userDropdown");

  userMenuBtn?.addEventListener("click", function (e) {
    e.stopPropagation();
    closeAllDropdowns();
    userDropdown.classList.toggle("show");
  });

  document.addEventListener("click", function () {
    closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll(".user-dropdown");
  dropdowns.forEach((dropdown) => dropdown.classList.remove("show"));
}

// Notifications
function setupNotifications() {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationPanel = document.getElementById("notificationPanel");
  const closeNotifications = document.getElementById("closeNotifications");
  const overlay = document.getElementById("overlay");

  notificationBtn?.addEventListener("click", function () {
    notificationPanel.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  closeNotifications?.addEventListener("click", function () {
    notificationPanel.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Mark notifications as read when panel is opened
  notificationPanel?.addEventListener("transitionend", function () {
    if (notificationPanel.classList.contains("open")) {
      markNotificationsAsRead();
    }
  });
}

function markNotificationsAsRead() {
  const unreadNotifications = document.querySelectorAll(
    ".notification-item.unread"
  );
  unreadNotifications.forEach((notification) => {
    notification.classList.remove("unread");
  });

  const badge = document.querySelector(".notification-badge");
  if (badge) {
    badge.style.display = "none";
  }
}

// Modal functionality
function setupModals() {
  const modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Setup form submissions
  const addPackageForm = document.getElementById("addPackageForm");
  if (addPackageForm) {
    addPackageForm.addEventListener("submit", handleAddPackage);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// Global modal functions
window.openAddPackageModal = () => openModal("addPackageModal");
window.openAddCourierModal = () => openModal("addCourierModal");
window.closeModal = closeModal;

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById("globalSearch");

  searchInput?.addEventListener(
    "input",
    debounce(function (e) {
      const query = e.target.value.trim();
      if (query.length > 2) {
        performSearch(query);
      } else {
        clearSearchResults();
      }
    }, 300)
  );
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function performSearch(query) {
  // Implement search functionality
  console.log("Searching for:", query);
  // This would typically make an API call to search packages, couriers, etc.
}

function clearSearchResults() {
  // Clear search results
  console.log("Clearing search results");
}

// Data loading
async function loadDashboardData() {
  try {
    showLoading();

    // Load dashboard statistics
    const stats = await fetchDashboardStats();
    updateStatsCards(stats);

    // Load recent packages
    const packages = await fetchRecentPackages();
    updatePackagesList(packages);

    // Load top couriers
    const couriers = await fetchTopCouriers();
    updateCouriersList(couriers);

    hideLoading();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    showError("Failed to load dashboard data");
    hideLoading();
  }
}

async function fetchDashboardStats() {
  // Mock data - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPackages: 1247,
        activeDeliveries: 89,
        activeCouriers: 23,
        deliveryRate: 98.5,
      });
    }, 1000);
  });
}

async function fetchRecentPackages() {
  try {
    const response = await fetch("/api/packages/");
    if (!response.ok) throw new Error("Failed to fetch packages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching packages:", error);
    // Return mock data as fallback
    return [
      {
        id: "DR001",
        sender: "John Doe",
        recipient: "Jane Smith",
        status: "in_transit",
        eta: "2:30 PM",
      },
      {
        id: "DR002",
        sender: "Alice Johnson",
        recipient: "Bob Wilson",
        status: "delivered",
        eta: "Completed",
      },
    ];
  }
}

async function fetchTopCouriers() {
  try {
    const response = await fetch("/api/couriers/");
    if (!response.ok) throw new Error("Failed to fetch couriers");
    const data = await response.json();
    
    // Ensure we return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching couriers:", error);
    // Return fallback data as array
    return [
      {
        id: 1,
        name: "Michael Johnson",
        username: "mjohnson",
        deliveries: 150,
        recent_deliveries: 45,
        success_rate: 98.0,
        rating: 4.8,
        status: "online",
      },
      {
        id: 2,
        name: "Sarah Williams", 
        username: "swilliams",
        deliveries: 132,
        recent_deliveries: 38,
        success_rate: 97.0,
        rating: 4.7,
        status: "online",
      },
      {
        id: 3,
        name: "James Mwanga",
        username: "jmwanga", 
        deliveries: 98,
        recent_deliveries: 28,
        success_rate: 96.0,
        rating: 4.6,
        status: "offline",
      }
    ];
  }
}

function updateStatsCards(stats) {
  const totalPackagesEl = document.getElementById("totalPackages");
  const activeDeliveriesEl = document.getElementById("activeDeliveries");
  const activeCouriersEl = document.getElementById("activeCouriers");
  const deliveryRateEl = document.getElementById("deliveryRate");
  
  if (totalPackagesEl) {
    totalPackagesEl.textContent = stats.totalPackages || "0";
  }
  if (activeDeliveriesEl) {
    activeDeliveriesEl.textContent = stats.activeDeliveries || "0";
  }
  if (activeCouriersEl) {
    activeCouriersEl.textContent = stats.activeCouriers || "0";
  }
  if (deliveryRateEl) {
    deliveryRateEl.textContent = `${stats.deliveryRate || "0"}%`;
  }
}

function updatePackagesList(packages) {
  const packagesList = document.getElementById("recentPackages");
  if (!packagesList) return;

  packagesList.innerHTML = packages
    .map(
      (pkg) => `
        <div class="package-item">
            <div class="package-info">
                <div class="package-id">#${pkg.order_id || pkg.id}</div>
                <div class="package-details">
                    <span class="sender">${pkg.sender || "Unknown"}</span>
                    <span class="recipient">${pkg.recipient || "Unknown"}</span>
                </div>
            </div>
            <div class="package-status">
                <span class="status ${pkg.status}">${formatStatus(
        pkg.status
      )}</span>
                <span class="eta">${pkg.eta || "TBD"}</span>
            </div>
        </div>
    `
    )
    .join("");
}

function updateCouriersList(couriers) {
  const couriersList = document.getElementById("topCouriers");
  if (!couriersList) return;

  // Ensure couriers is an array
  if (!Array.isArray(couriers)) {
    console.error('Expected couriers to be an array, received:', typeof couriers, couriers);
    // Use fallback data
    couriers = [
      {
        name: "Michael Johnson",
        deliveries: 127,
        rating: 4.9,
        status: "online",
      },
      {
        name: "Sarah Williams",
        deliveries: 95,
        rating: 4.8,
        status: "online",
      },
      {
        name: "David Chen",
        deliveries: 88,
        rating: 4.7,
        status: "online",
      }
    ];
  }

  couriersList.innerHTML = couriers
    .map(
      (courier) => `
        <div class="courier-item">
            <div class="courier-avatar">
                <div class="avatar-fallback"><i class="fas fa-user"></i></div>
            </div>
            <div class="courier-info">
                <div class="courier-name">${
                  courier.name || courier.username
                }</div>
                <div class="courier-stats">
                    <span class="deliveries">${
                      courier.deliveries || 0
                    } deliveries</span>
                    <span class="rating">⭐ ${courier.rating || "N/A"}</span>
                </div>
            </div>
            <div class="courier-status ${
              courier.status || "offline"
            }">${formatStatus(courier.status || "offline")}</div>
        </div>
    `
    )
    .join("");
}

function formatStatus(status) {
  const statusMap = {
    in_transit: "In Transit",
    delivered: "Delivered",
    pending: "Pending",
    online: "Online",
    offline: "Offline",
  };
  return statusMap[status] || status;
}

// Charts initialization
function initializeCharts() {
  initializeDeliveryChart();
}

function initializeDeliveryChart() {
  const ctx = document.getElementById("deliveryChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Deliveries",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Pickups",
          data: [45, 49, 60, 71, 46, 35, 30],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#e2e8f0",
          },
        },
        x: {
          grid: {
            color: "#e2e8f0",
          },
        },
      },
    },
  });
}

// Map initialization
function initializeMap() {
  const mapContainer = document.getElementById("deliveryMap");
  if (!mapContainer) return;

  // Initialize map (replace with actual Google Maps implementation)
  mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #64748b;">
            <div style="text-align: center;">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Interactive map will be displayed here</p>
                <p style="font-size: 0.875rem;">Showing live delivery locations</p>
            </div>
        </div>
    `;

  // Setup map controls
  setupMapControls();
}

function setupMapControls() {
  const fullscreenBtn = document.getElementById("fullscreenMap");
  const refreshBtn = document.getElementById("refreshMap");

  fullscreenBtn?.addEventListener("click", toggleMapFullscreen);
  refreshBtn?.addEventListener("click", refreshMap);
}

function toggleMapFullscreen() {
  const mapCard = document.querySelector(".map-card");
  mapCard.classList.toggle("fullscreen");
  // Implement fullscreen functionality
}

function refreshMap() {
  const refreshBtn = document.getElementById("refreshMap");
  refreshBtn.classList.add("fa-spin");

  setTimeout(() => {
    refreshBtn.classList.remove("fa-spin");
    showNotification("Map refreshed", "success");
  }, 1000);
}

// Real-time updates
function setupRealTimeUpdates() {
  // Setup WebSocket connection for real-time updates
  // This is a mock implementation
  setInterval(() => {
    // Simulate real-time updates
    updateRealTimeData();
  }, 30000); // Update every 30 seconds
}

function updateRealTimeData() {
  // Update stats, packages, couriers with real-time data
  console.log("Updating real-time data...");
}

// Form handlers
function handleAddPackage(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const packageData = Object.fromEntries(formData.entries());

  // Validate form data
  if (!validatePackageData(packageData)) {
    return;
  }

  // Submit package data
  submitPackage(packageData);
}

function validatePackageData(data) {
  const required = [
    "senderName",
    "recipientName",
    "pickupAddress",
    "deliveryAddress",
    "packageType",
    "weight",
  ];

  for (const field of required) {
    if (!data[field] || data[field].trim() === "") {
      showError(
        `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
      );
      return false;
    }
  }

  return true;
}

async function submitPackage(packageData) {
  try {
    showLoading();

    const response = await fetch("/api/packages/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify(packageData),
    });

    if (!response.ok) {
      throw new Error("Failed to create package");
    }

    const result = await response.json();

    closeModal("addPackageModal");
    showNotification("Package created successfully!", "success");
    loadDashboardData(); // Refresh data

    hideLoading();
  } catch (error) {
    console.error("Error creating package:", error);
    showError("Failed to create package");
    hideLoading();
  }
}

// Utility functions
function showLoading() {
  // Show loading indicator
  document.body.classList.add("loading");
}

function hideLoading() {
  // Hide loading indicator
  document.body.classList.remove("loading");
}

function showNotification(message, type = "info") {
  // Create and show notification
  const notification = document.createElement("div");
  notification.className = `alert alert-${type}`;
  notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;

  const container = document.querySelector(".page-content");
  if (container) {
    container.insertBefore(notification, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

function showError(message) {
  showNotification(message, "error");
}

function getCSRFToken() {
  return document.querySelector("[name=csrfmiddlewaretoken]")?.value || "";
}

// Quick action functions (global)
window.generateReport = function () {
  showNotification("Generating report...", "info");
  // Implement report generation
};

window.openChatbot = function () {
  // Redirect to chatbot page or open chatbot modal
  window.location.href = "/chatbot/";
};

// Alert close functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("alert-close")) {
    e.target.parentElement.remove();
  }
});

// Time filter change handler
document.addEventListener("change", function (e) {
  if (e.target.id === "analyticsTimeFilter") {
    const timeRange = e.target.value;
    updateAnalyticsChart(timeRange);
  }
});

function updateAnalyticsChart(timeRange) {
  console.log("Updating analytics for time range:", timeRange);
  // Implement chart update based on time range
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.getElementById("globalSearch");
    searchInput?.focus();
  }

  // Escape to close modals/panels
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal.show");
    if (openModal) {
      closeModal(openModal.id);
    }

    const openPanel = document.querySelector(".notification-panel.open");
    if (openPanel) {
      openPanel.classList.remove("open");
      document.getElementById("overlay").classList.remove("show");
    }
  }
});
