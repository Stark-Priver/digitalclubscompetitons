// Dashboard-specific JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeDashboardSpecific();
});

function initializeDashboardSpecific() {
  updateDashboardStats();
  initializeRealTimeMap();
  setupAutoRefresh();
}

function updateDashboardStats() {
  // Animate counter numbers
  animateCounters();

  // Update progress indicators
  updateProgressIndicators();
}

function animateCounters() {
  const counters = [
    { element: document.getElementById("totalPackages"), target: 1247 },
    { element: document.getElementById("activeDeliveries"), target: 89 },
    { element: document.getElementById("activeCouriers"), target: 23 },
  ];

  counters.forEach((counter) => {
    if (counter.element) {
      animateCounter(counter.element, counter.target);
    }
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 20);
}

function updateProgressIndicators() {
  // Update delivery rate with animation
  const deliveryRateElement = document.getElementById("deliveryRate");
  if (deliveryRateElement) {
    animatePercentage(deliveryRateElement, 98.5);
  }
}

function animatePercentage(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = `${current.toFixed(1)}%`;
  }, 20);
}

function initializeRealTimeMap() {
  // Initialize Google Maps with real-time delivery tracking
  const mapElement = document.getElementById("deliveryMap");
  if (!mapElement) return;

  // Mock real-time map implementation
  mapElement.innerHTML = `
        <div class="map-placeholder">
            <div class="map-controls">
                <button class="map-control-btn active" data-filter="all">
                    <i class="fas fa-globe"></i> All
                </button>
                <button class="map-control-btn" data-filter="active">
                    <i class="fas fa-shipping-fast"></i> Active
                </button>
                <button class="map-control-btn" data-filter="pending">
                    <i class="fas fa-clock"></i> Pending
                </button>
            </div>
            <div class="map-content">
                <div class="delivery-markers">
                    <div class="marker active" style="top: 30%; left: 25%;" data-package="DR001">
                        <i class="fas fa-truck"></i>
                        <div class="marker-tooltip">Package #DR001<br>ETA: 2:30 PM</div>
                    </div>
                    <div class="marker pending" style="top: 60%; left: 70%;" data-package="DR003">
                        <i class="fas fa-box"></i>
                        <div class="marker-tooltip">Package #DR003<br>Pickup Scheduled</div>
                    </div>
                    <div class="marker completed" style="top: 80%; left: 40%;" data-package="DR002">
                        <i class="fas fa-check"></i>
                        <div class="marker-tooltip">Package #DR002<br>Delivered</div>
                    </div>
                </div>
                <div class="map-overlay">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>Live Delivery Tracking</p>
                </div>
            </div>
        </div>
    `;

  // Add map control functionality
  setupMapControls();

  // Add marker interactions
  setupMarkerInteractions();
}

function setupMapControls() {
  const mapControls = document.querySelectorAll(".map-control-btn");

  mapControls.forEach((control) => {
    control.addEventListener("click", function () {
      // Remove active class from all controls
      mapControls.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked control
      this.classList.add("active");

      // Filter markers based on selection
      const filter = this.dataset.filter;
      filterMapMarkers(filter);
    });
  });
}

function filterMapMarkers(filter) {
  const markers = document.querySelectorAll(".marker");

  markers.forEach((marker) => {
    if (filter === "all" || marker.classList.contains(filter)) {
      marker.style.display = "block";
    } else {
      marker.style.display = "none";
    }
  });
}

function setupMarkerInteractions() {
  const markers = document.querySelectorAll(".marker");

  markers.forEach((marker) => {
    marker.addEventListener("click", function () {
      const packageId = this.dataset.package;
      showPackageDetails(packageId);
    });

    marker.addEventListener("mouseenter", function () {
      const tooltip = this.querySelector(".marker-tooltip");
      if (tooltip) {
        tooltip.style.display = "block";
      }
    });

    marker.addEventListener("mouseleave", function () {
      const tooltip = this.querySelector(".marker-tooltip");
      if (tooltip) {
        tooltip.style.display = "none";
      }
    });
  });
}

function showPackageDetails(packageId) {
  // Create package details modal or sidebar
  console.log("Showing details for package:", packageId);

  // Mock package details
  const packageDetails = {
    DR001: {
      id: "DR001",
      sender: "John Doe",
      recipient: "Jane Smith",
      status: "In Transit",
      eta: "2:30 PM",
      courier: "Michael Johnson",
      pickupTime: "10:30 AM",
      estimatedDelivery: "2:30 PM",
    },
    DR002: {
      id: "DR002",
      sender: "Alice Johnson",
      recipient: "Bob Wilson",
      status: "Delivered",
      eta: "Completed",
      courier: "Sarah Williams",
      pickupTime: "9:15 AM",
      deliveryTime: "1:45 PM",
    },
    DR003: {
      id: "DR003",
      sender: "Mike Brown",
      recipient: "Sarah Davis",
      status: "Pending",
      eta: "Pickup Scheduled",
      courier: "Not Assigned",
      scheduledPickup: "3:00 PM",
    },
  };

  const details = packageDetails[packageId];
  if (details) {
    showPackageModal(details);
  }
}

function showPackageModal(packageDetails) {
  // Create modal HTML
  const modalHTML = `
        <div class="modal show" id="packageDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Package Details - ${packageDetails.id}</h3>
                    <button class="modal-close" onclick="closeModal('packageDetailsModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="package-details-grid">
                        <div class="detail-item">
                            <label>Sender:</label>
                            <span>${packageDetails.sender}</span>
                        </div>
                        <div class="detail-item">
                            <label>Recipient:</label>
                            <span>${packageDetails.recipient}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status ${packageDetails.status
                              .toLowerCase()
                              .replace(" ", "-")}">${
    packageDetails.status
  }</span>
                        </div>
                        <div class="detail-item">
                            <label>Courier:</label>
                            <span>${packageDetails.courier}</span>
                        </div>
                        ${
                          packageDetails.pickupTime
                            ? `
                        <div class="detail-item">
                            <label>Pickup Time:</label>
                            <span>${packageDetails.pickupTime}</span>
                        </div>
                        `
                            : ""
                        }
                        ${
                          packageDetails.deliveryTime
                            ? `
                        <div class="detail-item">
                            <label>Delivery Time:</label>
                            <span>${packageDetails.deliveryTime}</span>
                        </div>
                        `
                            : ""
                        }
                        ${
                          packageDetails.estimatedDelivery
                            ? `
                        <div class="detail-item">
                            <label>Estimated Delivery:</label>
                            <span>${packageDetails.estimatedDelivery}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="package-actions">
                        <button class="btn btn-primary" onclick="trackPackage('${
                          packageDetails.id
                        }')">
                            <i class="fas fa-map-marker-alt"></i> Track Package
                        </button>
                        <button class="btn btn-secondary" onclick="contactCourier('${
                          packageDetails.courier
                        }')">
                            <i class="fas fa-phone"></i> Contact Courier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Add modal to DOM
  const existingModal = document.getElementById("packageDetailsModal");
  if (existingModal) {
    existingModal.remove();
  }

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Add styles for the modal
  if (!document.getElementById("packageModalStyles")) {
    const styles = `
            <style id="packageModalStyles">
                .package-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .detail-item label {
                    font-weight: 600;
                    color: #64748b;
                    font-size: 0.875rem;
                }
                
                .detail-item span {
                    color: #1e293b;
                }
                
                .package-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .map-placeholder {
                    height: 400px;
                    position: relative;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                
                .map-controls {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    z-index: 10;
                }
                
                .map-control-btn {
                    padding: 0.5rem 1rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .map-control-btn:hover {
                    background: #f8fafc;
                }
                
                .map-control-btn.active {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }
                
                .map-content {
                    height: 100%;
                    position: relative;
                }
                
                .map-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #94a3b8;
                    z-index: 1;
                }
                
                .map-overlay i {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                    display: block;
                }
                
                .delivery-markers {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 5;
                }
                
                .marker {
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: white;
                    font-size: 0.875rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transform: translate(-50%, -50%);
                }
                
                .marker:hover {
                    transform: translate(-50%, -50%) scale(1.2);
                }
                
                .marker.active {
                    background: #10b981;
                    animation: pulse-green 2s infinite;
                }
                
                .marker.pending {
                    background: #f59e0b;
                    animation: pulse-yellow 2s infinite;
                }
                
                .marker.completed {
                    background: #3b82f6;
                }
                
                .marker-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    margin-bottom: 0.5rem;
                    display: none;
                    z-index: 20;
                }
                
                .marker-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 4px solid transparent;
                    border-top-color: rgba(0, 0, 0, 0.8);
                }
                
                @keyframes pulse-green {
                    0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    50% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(16, 185, 129, 0); }
                }
                
                @keyframes pulse-yellow {
                    0%, 100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(245, 158, 11, 0.7); }
                    50% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(245, 158, 11, 0); }
                }
            </style>
        `;
    document.head.insertAdjacentHTML("beforeend", styles);
  }
}

function setupAutoRefresh() {
  // Auto-refresh dashboard data every 30 seconds
  setInterval(() => {
    refreshDashboardData();
  }, 30000);
}

function refreshDashboardData() {
  // Refresh stats
  updateDashboardStats();

  // Refresh packages list
  const packagesContainer = document.getElementById("recentPackages");
  if (packagesContainer) {
    // Add loading state
    packagesContainer.style.opacity = "0.6";

    setTimeout(() => {
      // Simulate data refresh
      packagesContainer.style.opacity = "1";
    }, 1000);
  }

  // Update map markers
  updateMapMarkers();
}

function updateMapMarkers() {
  const markers = document.querySelectorAll(".marker");

  markers.forEach((marker) => {
    // Simulate position updates for active deliveries
    if (marker.classList.contains("active")) {
      const currentTop = parseFloat(marker.style.top);
      const currentLeft = parseFloat(marker.style.left);

      // Random movement within bounds
      const newTop = Math.max(
        10,
        Math.min(90, currentTop + (Math.random() - 0.5) * 5)
      );
      const newLeft = Math.max(
        10,
        Math.min(90, currentLeft + (Math.random() - 0.5) * 5)
      );

      marker.style.top = `${newTop}%`;
      marker.style.left = `${newLeft}%`;
    }
  });
}

// Global functions for package actions
window.trackPackage = function (packageId) {
  console.log("Tracking package:", packageId);
  // Implement package tracking functionality
  showNotification(`Tracking package ${packageId}`, "info");
};

window.contactCourier = function (courierName) {
  console.log("Contacting courier:", courierName);
  // Implement courier contact functionality
  showNotification(`Contacting ${courierName}`, "info");
};

// Enhanced notification system for dashboard
function showDashboardNotification(title, message, type = "info") {
  const notification = document.createElement("div");
  notification.className = "dashboard-notification";
  notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add to notification area
  let notificationArea = document.getElementById("dashboardNotifications");
  if (!notificationArea) {
    notificationArea = document.createElement("div");
    notificationArea.id = "dashboardNotifications";
    notificationArea.className = "dashboard-notifications";
    document.body.appendChild(notificationArea);
  }

  notificationArea.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "fa-check-circle",
    warning: "fa-exclamation-triangle",
    error: "fa-times-circle",
    info: "fa-info-circle",
  };
  return icons[type] || icons.info;
}

// Add notification styles
if (!document.getElementById("dashboardNotificationStyles")) {
  const notificationStyles = `
        <style id="dashboardNotificationStyles">
            .dashboard-notifications {
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 3000;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-width: 400px;
            }
            
            .dashboard-notification {
                background: white;
                border-radius: 0.5rem;
                padding: 1rem;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #3b82f6;
                color: white;
                flex-shrink: 0;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-content h4 {
                margin: 0 0 0.25rem 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: #1e293b;
            }
            
            .notification-content p {
                margin: 0;
                font-size: 0.75rem;
                color: #64748b;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.25rem;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                color: #64748b;
                background: #f1f5f9;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .dashboard-notifications {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        </style>
    `;
  document.head.insertAdjacentHTML("beforeend", notificationStyles);
}
