const express = require("express");
const app = express();

app.use(express.json());

let users = [];

app.use((req, res, next) => {
    const currentTime = new Date().toLocaleString();
    console.log(`Request received at: ${currentTime}`);
    console.log(`${req.method} ${req.url}`);
    next();
});

const sendResponse = (res, message, data = null) => {
    res.json({
        message,
        time: new Date().toLocaleString(),
        data
    });
};

app.get("/", (req, res) => {
    sendResponse(res, "Server Running");
});

app.get("/users", (req, res) => {
    sendResponse(res, "Users fetched successfully", users);
});

app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return sendResponse(res, "Name and Email are required");
    }

    const exists = users.find(user => user.email === email);
    if (exists) {
        return sendResponse(res, "Email already exists");
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);

    sendResponse(res, "User added successfully", newUser);
});

app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return sendResponse(res, "User not found");
    }

    users.splice(index, 1);

    sendResponse(res, "User deleted successfully");
});

app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return sendResponse(res, "User not found");
    }

    sendResponse(res, "User fetched successfully", user);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendResponse(res, "All fields required");
    }

    if (email === "admin@gmail.com" && password === "1234") {
        return sendResponse(res, "Login Success");
    }

    sendResponse(res, "Invalid Credentials");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});