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
      <div class="pizza-title">${pizza.title}</div>
      <div class="pizza-footer">
        <div class="pizza-rating">
          <span class="star">★</span>
          <span>${pizza.rating}</span>
          <span>(${pizza.deliveryTime})</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="pizza-price">₹${pizza.price}</span>
          <button class="add-btn">+</button>
        </div>
      </div>
    </div>
  `;
  
  pizzaCard.innerHTML = imageHTML + infoHTML;
  return pizzaCard;
}

// Function to create a carousel item element
function createCarouselItem(item, index, isCenter = false) {
  const carouselItem = document.createElement('div');
  carouselItem.className = 'carousel-item';
  if (isCenter) {
    carouselItem.classList.add('center');
  }
  
  // Create item image
  const imageHTML = `
    <div class="item-image">
      ${item.discount ? `<div class="discount-badge">${item.discount}%</div>` : ''}
      <img src="${item.imagePath}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover;">
    </div>
  `;
  
  // Create item info section
  const infoHTML = `
    <div class="item-info">
      <div class="item-title">${item.title}</div>
      <div class="item-footer">
        <div class="item-rating">
          <span class="star">★</span>
          <span>${item.rating}</span>
          <span>(${item.deliveryTime})</span>
        </div>
        <span class="item-price">₹${item.price}</span>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
        <div class="qty-display" id="qty-${index}">${item.quantity}</div>
        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
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
  
  // Create and append carousel items
  popularItems.forEach((item, index) => {
    const isCenter = index === 0; // First item is centered
    const carouselItem = createCarouselItem(item, index, isCenter);
    carousel.appendChild(carouselItem);
  });
  
  // Initialize carousel position
  moveCarousel(0);
}

// Global variables for carousel
let currentSlide = 0;
let quantities = [];

// Function to move the carousel
function moveCarousel(direction) {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  const items = carousel.children;
  const totalSlides = items.length;
  
  if (totalSlides === 0) return;
  
  // Remove center class from current item
  items[currentSlide].classList.remove('center');
  
  // Update indicators
  updateIndicators(currentSlide, false);
  
  // Update current slide
  currentSlide += direction;
  
  // Handle wrap around with infinite scroll effect
  if (currentSlide >= totalSlides) {
    // Clone first item and append to end for smooth transition
    const firstItemClone = items[0].cloneNode(true);
    carousel.appendChild(firstItemClone);
    
    // Animate to the clone
    const itemWidth = 330; // 300px width + 30px margins
    let offset = -(currentSlide * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2);
    carousel.style.transition = 'transform 0.3s ease';
    carousel.style.transform = `translateX(${offset}px)`;
    
    // After animation completes, jump to the real first item without animation
    setTimeout(() => {
      carousel.style.transition = 'none';
      currentSlide = 0;
      offset = -(currentSlide * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2);
      carousel.style.transform = `translateX(${offset}px)`;
      carousel.removeChild(firstItemClone);
      
      // Update indicators
      updateIndicators(currentSlide, true);
      
      // Re-enable transitions after jump
      setTimeout(() => {
        carousel.style.transition = 'transform 0.3s ease';
      }, 50);
    }, 300);
  } else if (currentSlide < 0) {
    // Clone last item and prepend to beginning for smooth transition
    const lastItemClone = items[totalSlides - 1].cloneNode(true);
    carousel.insertBefore(lastItemClone, items[0]);
    
    // Adjust position to account for the new first item
    const itemWidth = 330;
    let offset = -((currentSlide + 1) * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2);
    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(${offset}px)`;
    
    // Force reflow
    carousel.offsetHeight;
    
    // Animate to the real position
    currentSlide = totalSlides - 1;
    carousel.style.transition = 'transform 0.3s ease';
    offset = -(currentSlide * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2);
    carousel.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    updateIndicators(currentSlide, true);
    
    // After animation completes, remove the clone
    setTimeout(() => {
      carousel.removeChild(lastItemClone);
    }, 300);
  } else {
    // Normal slide movement
    // Add center class to new current item
    items[currentSlide].classList.add('center');
    
    // Update indicators
    updateIndicators(currentSlide, true);
    
    // Calculate transform
    const itemWidth = 330; // 300px width + 30px margins
    const offset = -(currentSlide * itemWidth) + (window.innerWidth / 2) - (itemWidth / 2);
    
    carousel.style.transition = 'transform 0.3s ease';
    carousel.style.transform = `translateX(${offset}px)`;
  }
}

// Function to update indicators
function updateIndicators(index, isActive) {
  const indicators = document.querySelectorAll('.indicator');
  if (indicators.length === 0) return;
  
  indicators.forEach(indicator => {
    indicator.classList.remove('active');
  });
  
  if (isActive && indicators[index]) {
    indicators[index].classList.add('active');
  }
}

// Function to handle indicator click
function handleIndicatorClick(event) {
  const index = parseInt(event.target.dataset.index);
  if (isNaN(index)) return;
  
  const diff = index - currentSlide;
  if (diff !== 0) {
    moveCarousel(diff);
  }
}

// Function to change quantity
function changeQuantity(itemIndex, change) {
  const qtyDisplay = document.getElementById(`qty-${itemIndex}`);
  if (!qtyDisplay) return;
  
  let quantity = parseInt(qtyDisplay.textContent) + change;
  if (quantity < 1) quantity = 1;
  
  qtyDisplay.textContent = quantity;
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

// Auto-scroll interval variable
let carouselInterval;

// Function to start auto-scrolling
function startCarouselAutoScroll() {
  // Clear any existing interval
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
  
  // Set new interval to move carousel every 3 seconds
  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 3000);
}

// Function to stop auto-scrolling
function stopCarouselAutoScroll() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderPizzaCards();
  renderPopularItems();
  
  // Set up indicator click events
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach(indicator => {
    indicator.addEventListener('click', handleIndicatorClick);
  });
  
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
  
  // Initialize the first indicator as active
  updateIndicators(0, true);
  
  // Add hover events to pause/resume auto-scroll
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarouselAutoScroll);
    carouselContainer.addEventListener('mouseleave', startCarouselAutoScroll);
  }
  
  // Start auto-scrolling
  startCarouselAutoScroll();
});