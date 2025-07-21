// Function to fetch the pizza data from JSON file
async function fetchPizzaData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data.pizzas;
  } catch (error) {
    console.error('Error loading pizza data:', error);
    return [];
  }
}

// Function to fetch the popular items data from JSON file
async function fetchPopularItemsData() {
  try {
    const response = await fetch('popular-items.json');
    const data = await response.json();
    return data.popularItems;
  } catch (error) {
    console.error('Error loading popular items data:', error);
    return [];
  }
}

// Function to create a pizza card element
function createPizzaCard(pizza) {
  const pizzaCard = document.createElement('div');
  pizzaCard.className = 'pizza-card';
  
  // Create pizza image
  const imageHTML = `
    <div style="position: relative;">
      ${pizza.discount ? `<div class="discount-badge">${pizza.discount}%</div>` : ''}
      <img class="pizza-image" src="${pizza.imagePath}" alt="${pizza.title}" style="height: 200px; width: 100%; object-fit: cover;">
    </div>
  `;
  
  // Create pizza info section
  const infoHTML = `
    <div class="pizza-info">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="pizza-title">${pizza.title}</div>
        <div class="pizza-price" style="font-size: 18px; font-weight: bold; color: #333;">₹${pizza.price}</div>
      </div>
      <div class="pizza-footer">
      <div class="pizza-footer-space" >
        <div class="pizza-rating" style="background-color: #f0f0f0; padding: 0px 8px; border-radius: 4px; margin-right: 8px;">
          <img src="assets/star-filled.png" alt="star" style="width: 14px; height: 14px; margin-right: 2px;">
          <span >${pizza.rating}</span>
          </div>
          

           <div class="pizza-rating" style="background-color: #BEBEBE; padding: 0px 4px; border-radius: 5px;">
           <div class="pizza-rating" style="background-color: #F7F8FA; padding: 4px 4px; border-radius: 5px;">
          <span>(${pizza.deliveryTime})</span>
           </div>
           </div>
        </div>
        <button class="add-btn">+</button>
      </div>
    </div>
  `;
  
  pizzaCard.innerHTML = imageHTML + infoHTML;
  return pizzaCard;
}

// Function to create a carousel item element
function createCarouselItem(item, index, isActive = false) {
  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  carouselItem.dataset.index = index;
  if (isActive) {
    carouselItem.classList.add('active');
  }

  // Create item image
  const imageHTML = `
    <div class="item-image">
      ${item.discount ? `<div class="discount-badge">${item.discount}%</div>` : ''}
      <img src="${item.imagePath}" alt="${item.title}">
    </div>
  `;

  // Quantity controls UI (matches the image)
  let quantityControlsHTML = '';
  if (item.quantity === 0) {
    quantityControlsHTML = `
      <button class="qty-btn plus">
          <img src="assets/move-to-cart.png" alt="plus" style="width: 26px; height: 25px;">
        </button>
    `;
  } else {
    quantityControlsHTML = `
      <div class="quantity-controls custom-qty-controls" style="display: flex; align-items: center; justify-content: center;  background: #F3BA00; border-radius: 5px; height: 28px; width: 90px; margin-left: 20px;">
        <button class="qty-btn minus" >
          <img src="assets/minus-from-cart.svg" alt="minus" style="width: 26px; height: 25px;">
        </button>
        <div class="qty-display" style="background: #fff; color: #222; font-size: 16px; font-weight: 500; width: 40px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 0px; margin: 0 0px;">${item.quantity}</div>
        <button class="qty-btn plus">
          <img src="assets/add-to-cart.svg" alt="plus" style="width: 26px; height: 25px;">
        </button>
      </div>
    `;
  }

  // Create item info section
  const infoHTML = `
    <div class="item-info">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="pizza-title">${item.title}</div>
        <div class="pizza-price" style="font-size: 18px; font-weight: bold; color: #333;">₹${item.price}</div>
      </div>
      <div class="pizza-footer">
        <div class="pizza-footer-space">
          <div class="pizza-rating" style="background-color: #f0f0f0; padding: 0px 8px; border-radius: 4px; margin-right: 8px;">
            <img src="assets/star-filled.png" alt="star" style="width: 14px; height: 14px; margin-right: 2px;">
            <span>${item.rating}</span>
          </div>
          <div class="pizza-rating" style="background-color: #BEBEBE; padding: 0px 4px; border-radius: 5px;">
            <div class="pizza-rating" style="background-color: #F7F8FA; padding: 4px 4px; border-radius: 5px;">
              <span>(${item.deliveryTime})</span>
            </div>
          </div>
        </div>
        ${quantityControlsHTML}
      </div>
    </div>
  `;

  carouselItem.innerHTML = imageHTML + infoHTML;

  // Add event listeners for quantity buttons
  setTimeout(() => {
    const minusBtn = carouselItem.querySelector('.qty-btn.minus');
    const plusBtn = carouselItem.querySelector('.qty-btn.plus');
    if (minusBtn) {
      minusBtn.addEventListener('click', () => changeQuantity(index, -1));
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', () => changeQuantity(index, 1));
    }
  }, 0);

  return carouselItem;
}

// Function to render all pizza cards
async function renderPizzaCards() {
  const pizzaGrid = document.querySelector('.pizza-grid');
  if (!pizzaGrid) return;
  
  // Clear existing content
  pizzaGrid.innerHTML = '';
  
  // Fetch pizza data
  const pizzas = await fetchPizzaData();
  
  // Create and append pizza cards
  pizzas.forEach(pizza => {
    const pizzaCard = createPizzaCard(pizza);
    pizzaGrid.appendChild(pizzaCard);
  });
}

// Function to render popular items carousel
async function renderPopularItems() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  // Clear existing content
  carousel.innerHTML = '';
  
  // Fetch popular items data
  const popularItems = await fetchPopularItemsData();
  
  // Create and append all carousel items
  popularItems.forEach((item, index) => {
    const carouselItem = createCarouselItem(item, index);
    carousel.appendChild(carouselItem);
  });
  
  // Initialize carousel
  initializeCarousel();
}

// Global variables for carousel
let currentIndex = 0;
let itemWidth = 270; // Width of each item including margins
let quantities = [];

// Function to initialize the carousel
function initializeCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  const items = carousel.children;
  const totalItems = items.length;
  
  if (totalItems === 0) return;
  
  // Set initial active state
  updateActiveItems();
  
  // Position carousel to show first three items
  positionCarousel();
}

// Function to move the carousel
function moveCarousel(direction) {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  const items = carousel.children;
  const totalItems = items.length;
  
  if (totalItems === 0) return;
  
  // Always move forward in the specified direction
  currentIndex = (currentIndex + direction + totalItems) % totalItems;
  
  // Update active items
  updateActiveItems();
  
  // Position carousel
  positionCarousel();
}

// Function to update which items are active
function updateActiveItems() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  const items = carousel.children;
  const totalItems = items.length;
  
  // Remove active class from all items
  for (let i = 0; i < totalItems; i++) {
    items[i].classList.remove('active');
  }
  
  // Add active class to current item
  items[currentIndex].classList.add('active');
}

// Function to position the carousel
function positionCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const items = carousel.children;
  const totalItems = items.length;
  const containerWidth = document.querySelector('.carousel-container').offsetWidth;

  // Calculate offset to always show 3 items, loop endlessly
  let offset = -(currentIndex * itemWidth);

  // If less than 3 items, center them
  if (totalItems <= 3) {
    offset = (containerWidth - totalItems * itemWidth) / 2;
  }

  carousel.style.transition = 'transform 0.3s ease';
  carousel.style.transform = `translateX(${offset}px)`;
}

// Function to change quantity
function changeQuantity(itemIndex, change) {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  const item = carousel.children[itemIndex];
  if (!item) return;

  // Find the qty display and parse value
  const qtyDisplay = item.querySelector('.qty-display');
  let quantity = qtyDisplay ? parseInt(qtyDisplay.textContent) : 0;
  quantity += change;
  if (quantity < 0) quantity = 0;

  // Update the item.quantity in the data (if you want to persist)
  // If you want to update the UI, re-render the item
  // For simplicity, just update the UI here:
  if (quantity === 0) {
    // Replace with only plus button
    item.querySelector('.quantity-controls').outerHTML = `<button class="qty-btn plus">+</button>`;
    // Add event listener to new plus button
    setTimeout(() => {
      const plusBtn = item.querySelector('.qty-btn.plus');
      if (plusBtn) {
        plusBtn.addEventListener('click', () => changeQuantity(itemIndex, 1));
      }
    }, 0);
  } else {
    // Update the qty display
    if (qtyDisplay) qtyDisplay.textContent = quantity;
  }
}

// Video player functionality for YouTube embed
function setupVideoPlayer() {
  const videoWrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('foodVideo');
  const playOverlay = document.getElementById('playOverlay');
  const videoThumbnail = document.getElementById('videoThumbnail');

  if (videoWrapper && video && playOverlay && videoThumbnail) {
    // Show video and hide thumbnail/overlay on play
    playOverlay.addEventListener('click', function() {
      videoThumbnail.style.display = 'none';
      playOverlay.style.display = 'none';
      video.style.display = 'block';
      video.currentTime = 0;
      video.play();
    });

    // Pause video when clicking on it while playing
    video.addEventListener('click', function() {
      if (!video.paused) {
        video.pause();
      }
    });

    // Show overlay when paused
    video.addEventListener('pause', function() {
      playOverlay.style.display = 'flex';
    });

    // Show overlay when ended
    video.addEventListener('ended', function() {
      playOverlay.style.display = 'flex';
    });

    // Optional: Hide video and show thumbnail when overlay is shown again
    playOverlay.addEventListener('click', function() {
      // Only hide thumbnail on first play
      if (video.paused) {
        videoThumbnail.style.display = 'none';
        video.style.display = 'block';
      }
    });
  }
}

// Modal functions
function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.classList.remove('modal-open');
}

function submitRequest() {
  // Get form data
  const formData = {
    dishName: document.getElementById('dishName').value,
    customerName: document.getElementById('customerName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    description: document.getElementById('description').value
  };
  
  // Simple validation
  if (!formData.dishName || !formData.customerName || !formData.email) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Show success message and close modal
  alert('Thank you! Your dish request has been submitted successfully.');
  
  // Reset form
  document.getElementById('requestForm').reset();
  
  // Close modal
  closeModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderPizzaCards();
  renderPopularItems();
  setupVideoPlayer();

  // Handle window resize for carousel
  window.addEventListener('resize', () => {
    moveCarousel(0);
  });

  // Close modal when clicking outside
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
});

// Mobile nav toggle for responsive navigation
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
});