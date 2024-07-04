let products = [];

async function fetchProducts() {
    try {
        const response = await fetch("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json");
        products = await response.json();
        filterProducts(); // Initial call to display products based on the default selected category
    } catch (error) {
        console.error("Error fetching products", error);
    }
}

function displayProducts(filteredProducts) {
    const productsContainer = document.querySelector(".products-container");
    productsContainer.innerHTML = ""; // Clear existing content

    filteredProducts.forEach(product => {
        // Create product card
        let discountOff = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
        let badgeText = product.badge_text
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        const badge = document.createElement("div");

        if (badgeText) {
            badge.className = "badge";
            badge.textContent = product.badge_text;
        }


        const productImage = document.createElement("div");
        productImage.className = "product-Img";
        const img = document.createElement("img");
        img.src = product.image;
        productImage.appendChild(img);

        const productDetails = document.createElement("div");
        productDetails.className = "product-details";

        const title = document.createElement("h3");
        const titleLink = document.createElement("a");
        titleLink.href = "#";
        titleLink.textContent = product.title;
        title.appendChild(titleLink);
        const titleVendor = document.createElement("div");
        const vendor = document.createElement("p");
        vendor.textContent = product.vendor;

        const priceContainer = document.createElement("div");
        const price = document.createElement("p");
        price.textContent = `Rs ${product.price}.00`;
        const originalPrice = document.createElement("p");
        const del = document.createElement("del");
        del.textContent = `${product.compare_at_price}.00`;
        originalPrice.appendChild(del);
        const discount = document.createElement("p");
        discount.innerHTML = `<span>${discountOff.toFixed(1)}%  Off</span>`;

        priceContainer.appendChild(price);
        priceContainer.appendChild(originalPrice);
        priceContainer.appendChild(discount);

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add To Cart";

        productDetails.appendChild(titleVendor);
        titleVendor.appendChild(title);

        titleVendor.appendChild(vendor);
        productDetails.appendChild(priceContainer);
        productDetails.appendChild(addButton);

        productCard.appendChild(badge);
        productCard.appendChild(productImage);
        productCard.appendChild(productDetails);

        productsContainer.appendChild(productCard);
    });
}

function filterProducts() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    console.log("selectedCategory: " + selectedCategory);
    let filteredProducts = [];

    if (selectedCategory === "All") {
        // Gather all products from all categories
        products.categories.forEach(category => {
            filteredProducts.push(...category.category_products);
        });

    } else {
        const category = products.categories.find(category => category.category_name === selectedCategory);
        if (category) {
            filteredProducts = category.category_products;

        }
    }

    console.log("Filtered Products:", filteredProducts);
    displayProducts(filteredProducts);
}

document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', filterProducts);
});

fetchProducts();
