# JTGeats Food Delivery Website

A static website implementation for JTGeats food delivery service, built using vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works on various screen sizes
- **Interactive Components**:
  - Popular Items Carousel with infinite loop scrolling
  - Video section with play/pause functionality
  - Request a Dish modal form
  - Contact form

## Implementation Details

### Popular Items Carousel
- Implemented using vanilla JavaScript
- Shows 3 items at a time with the center item highlighted
- Infinite loop scrolling (wraps around at the end)
- Auto-scrolls every 5 seconds
- Navigation arrows with hover effects

### Video Section
- Custom video player with play/pause functionality
- Custom play button overlay
- Toggles between play and pause on click

### Modal
- Opens when clicking "Request a Dish" button
- Form with validation
- Closes on Cancel or Submit
- Prevents body scrolling when open

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- jQuery (only for carousel functionality)
- Google Fonts (Open Sans)

## File Structure

- `index.html` - Main HTML file
- `style.css` - All styles
- `script.js` - JavaScript functionality
- `data.json` - Home Kitchen items data
- `popular-items.json` - Popular items data
- `assets/` - Images and other assets