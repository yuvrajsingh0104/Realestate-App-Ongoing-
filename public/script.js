const BASE_URL = 'http://localhost:3000/properties';

// Fetch properties and display them on the index page
async function fetchProperties() {
  try {
    const response = await fetch(BASE_URL);
    const properties = await response.json();
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';

    properties.forEach(property => {
      const propertyCard = document.createElement('div');
      propertyCard.className = 'property-card';
      propertyCard.innerHTML = `
        <h3>${property.title}</h3>
        <p>${property.description}</p>
        <p><strong>Price:</strong> $${property.price}</p>
        <p><strong>Location:</strong> ${property.location}</p>
        <button onclick="redirectToUpdate(${property.id})">Update</button>
        <button onclick="deleteProperty(${property.id})">Delete</button>
      `;
      propertyList.appendChild(propertyCard);
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
}

// Function to redirect to the update page with property ID
function redirectToUpdate(id) {
  window.location.href = `updateProperty.html?id=${id}`;
}

// Add property functionality
document.getElementById('add-property-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    location: document.getElementById('location').value
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    window.location.href = 'index.html'; // Redirect to the main page
  } else {
    console.error('Failed to add property');
  }
});

// Load the update form with existing property data on updateProperty.html
async function loadUpdateForm() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const property = await response.json();

    document.getElementById('update-id').value = property.id;
    document.getElementById('update-title').value = property.title;
    document.getElementById('update-description').value = property.description;
    document.getElementById('update-price').value = property.price;
    document.getElementById('update-location').value = property.location;
  } catch (error) {
    console.error('Error loading property for update:', error);
  }
}

// Update property functionality
document.getElementById('update-property-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('update-id').value;
  const data = {
    title: document.getElementById('update-title').value,
    description: document.getElementById('update-description').value,
    price: parseFloat(document.getElementById('update-price').value),
    location: document.getElementById('update-location').value
  };

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    window.location.href = 'index.html'; // Redirect to the main page
  } else {
    console.error('Failed to update property');
  }
});

// Delete property function
async function deleteProperty(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (response.ok) fetchProperties();
}

// Fetch properties on page load
if (document.getElementById('property-list')) {
  document.addEventListener('DOMContentLoaded', fetchProperties);
}

// Load update form if on update page
if (window.location.pathname.endsWith('updateProperty.html')) {
  document.addEventListener('DOMContentLoaded', loadUpdateForm);
}
