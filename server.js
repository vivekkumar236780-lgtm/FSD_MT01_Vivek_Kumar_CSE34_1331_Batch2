
const express = require("express");

const app = express();

const PORT = 3000;

// Middleware to accept JSON data
app.use(express.json());

// Initial product data
let products = [
    {
        id: 301,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 799,
        quantity: 25,
        inStock: true
    },
    {
        id: 302,
        name: "Notebook",
        category: "Stationery",
        price: 60,
        quantity: 100,
        inStock: true
    },
    {
        id: 303,
        name: "USB Keyboard",
        category: "Electronics",
        price: 999,
        quantity: 0,
        inStock: false
    }
];

// Generate unique product ID
let nextId = 304;

// Validate product details
function validateProduct(data) {
    return (
        data &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.category === "string" &&
        data.category.trim() !== "" &&
        typeof data.price === "number" &&
        Number.isFinite(data.price) &&
        data.price >= 0 &&
        typeof data.quantity === "number" &&
        Number.isInteger(data.quantity) &&
        data.quantity >= 0 &&
        typeof data.inStock === "boolean"
    );
}

// 1. GET all products
app.get("/api/products", (req, res) => {
    res.status(200).json(products);
});

// 2. POST a new product
app.post("/api/products", (req, res) => {

    if (!validateProduct(req.body)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const newProduct = {
        id: nextId++,
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        price: req.body.price,
        quantity: req.body.quantity,
        inStock: req.body.inStock
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// 3. FILTER products by category
app.get("/api/products/filter", (req, res) => {

    const category = req.query.category;

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            message: "Category query parameter is required"
        });
    }

    const filteredProducts = products.filter(
        p => p.category.toLowerCase() === category.trim().toLowerCase()
    );

    res.status(200).json(filteredProducts);
});

// 4. GET product by ID
app.get("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!Number.isInteger(id) || !product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});

// 5. PUT update product
app.put("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    if (!validateProduct(req.body)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    products[index] = {
        id: id,
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        price: req.body.price,
        quantity: req.body.quantity,
        inStock: req.body.inStock
    };

    res.status(200).json(products[index]);
});

// 6. DELETE product
app.delete("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    next(err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
