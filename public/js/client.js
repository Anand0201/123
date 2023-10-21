const addToCartButtons = document.querySelectorAll('.button--cart');

addToCartButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const productId = event.target.getAttribute('data-id');
    // Send an HTTP request to your server to add the product to the cart
    fetch(`/add_to_cart/${productId}`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          // Update the cart count on the page
          updateCartCount();
        } else {
          console.error('Failed to add product to cart');
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  });
});


document.addEventListener('DOMContentLoaded', function () {
    const cart = [];

    // Function to handle adding products to the cart
    const addToCart = (productId, productImage, productName, productPrice) => {
        const product = {
            id: productId,
            image: productImage,
            name: productName,
            price: productPrice
        };
        cart.push(product);
        updateCartCount(cart.length);
    };

    // Function to update the cart count in the UI
    const updateCartCount = (count) => {
        document.getElementById('cart-count').textContent = count;
    };

    // Add-to-cart button click event listener
    const addToCartButtons = document.querySelectorAll('.button--cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const productId = this.getAttribute('data-id');
            const productImage = this.getAttribute('data-image');
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            addToCart(productId, productImage, productName, productPrice);
        });
    });

    const removeFromCart = (index) => {
      if (index >= 0 && index < cart.length) {
          cart.splice(index, 1); // Remove the item from the cart array
          renderCart(); // Update the cart display
      }
    };

    // Event listener for "Remove" links
    const removeLinks = document.querySelectorAll('.remove-from-cart');
      removeLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
      });
    });
});
