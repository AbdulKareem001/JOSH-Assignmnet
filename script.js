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

  const imageHTML = `
    <div style="position: relative;">
      ${pizza.discount ? `<div class="discount-badge">${pizza.discount}%</div>` : ''}
      <img class="pizza-image" src="${pizza.imagePath}" alt="${pizza.title}" style="height: 200px; width: 100%; object-fit: cover;">
    </div>
  `;

  const infoHTML = `
    <div class="pizza-info">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="pizza-title">${pizza.title}</div>
        <div class="pizza-price" style="font-size: 18px; font-weight: bold; color: #333;">₹${pizza.price}</div>
      </div>
      <div class="pizza-footer">
        <div class="pizza-footer-space">
          <div class="pizza-rating" style="background-color: #f0f0f0; padding: 0px 8px; border-radius: 4px; margin-right: 8px;">
            <img src="assets/star-filled.png" alt="star" style="width: 14px; height: 14px; margin-right: 2px;">
            <span>${pizza.rating}</span>
          </div>
          <div class="pizza-rating" style="background-color: #BEBEBE; padding: 0px 4px; border-radius: 5px;">
            <div class="pizza-rating" style="background-color: #F7F8FA; padding: 4px 4px; border-radius: 5px;">
              <span>(${pizza.deliveryTime})</span>
            </div>
          </div>
        </div>
        <div class="pizza-counter"></div>
      </div>
    </div>
  `;

  pizzaCard.innerHTML = imageHTML + infoHTML;

  const counterContainer = pizzaCard.querySelector('.pizza-counter');
  renderAddButton(counterContainer);

  return pizzaCard;
}

function renderAddButton(container) {
  container.innerHTML = `
    <button class="add-btn">+</button>
  `;

  const addBtn = container.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    renderCounter(container, 1); // Start with 1 on first click
  });
}

function renderCounter(container, count) {
  container.innerHTML = `
    <div class="quantity-controls" style="display: flex; align-items: center; justify-content: center; background: #F3BA00; border-radius: 5px; height: 28px; width: 90px;">
      <button class="qty-btn minus" style="background: none; border: none; color: white; font-size: 18px; width: 26px;">-</button>
      <div class="qty-display" style="background: #fff; color: #222; font-size: 16px; font-weight: 500; width: 40px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 0px; margin: 0 0px;">${count}</div>
      <button class="qty-btn plus" style="background: none; border: none; color: white; font-size: 18px; width: 26px;">+</button>
    </div>
  `;

  const plusBtn = container.querySelector('.qty-btn.plus');
  const minusBtn = container.querySelector('.qty-btn.minus');
  const qtyDisplay = container.querySelector('.qty-display');

  plusBtn.addEventListener('click', () => {
    count++;
    qtyDisplay.textContent = count;
  });

  minusBtn.addEventListener('click', () => {
    count--;
    if (count <= 0) {
      renderAddButton(container); // Back to original "+" button
    } else {
      qtyDisplay.textContent = count;
    }
  });
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
        <div class="add-btn-container">
          <button class="add-btn" onclick="toggleCounter(this)">
            +
          </button>
        </div>
      </div>
    </div>
  `;

  carouselItem.innerHTML = imageHTML + infoHTML;
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
let currentIndex = 1;
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
  
  // Calculate item width to ensure 3 items are fully visible
  const margin = 20; // Total margin (left + right)
  itemWidth = Math.floor((containerWidth - margin) / 3) - margin;
  
  // Update item widths in the DOM
  for (let i = 0; i < totalItems; i++) {
    items[i].style.width = `${itemWidth}px`;
    items[i].style.minWidth = `${itemWidth}px`;
  }

  // Calculate offset to position items properly
  let offset = 0;
  
  // If we have the active item in the middle (index 1 of visible 3)
  if (currentIndex > 0 && currentIndex < totalItems - 1) {
    offset = -((currentIndex - 1) * (itemWidth + margin));
  } 
  // If we're at the first item
  else if (currentIndex === 0) {
    offset = 0;
  } 
  // If we're at the last item
  else if (currentIndex === totalItems - 1) {
    offset = -((totalItems - 3) * (itemWidth + margin));
  }

  carousel.style.transition = 'transform 0.3s ease';
  carousel.style.transform = `translateX(${offset}px)`;
}

// Function to toggle counter for popular items
function toggleCounter(btn) {
  const parent = btn.parentElement;
  renderCounter(parent, 1);
}

// Video player functionality for YouTube embed
function setupVideoPlayer() {
  const videoWrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('foodVideo');
  const playOverlay = document.getElementById('playOverlay');
  const videoThumbnail = document.querySelector('.video-thumbnail');

  if (videoWrapper && video && playOverlay) {
    // Show video and hide thumbnail/overlay on play
    playOverlay.addEventListener('click', function() {
      if (videoThumbnail) videoThumbnail.style.display = 'none';
      playOverlay.style.display = 'none';
      video.style.display = 'block';
      video.currentTime = 0;
      video.play();
    });

    // Pause video when clicking on it while playing
    video.addEventListener('click', function() {
      if (!video.paused) {
        video.pause();
        playOverlay.style.display = 'flex';
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