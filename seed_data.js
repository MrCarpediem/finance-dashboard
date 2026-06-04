const API_URL = "http://localhost:3001/api";

async function login() {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin@finance.com", password: "Admin@123" })
    });
    if (res.ok) {
        const data = await res.json();
        return data.data.accessToken;
    } else {
        console.error("Login failed:", await res.text());
        return null;
    }
}

async function createTransaction(token, amount, type, category, date, notes = "") {
    const res = await fetch(`${API_URL}/transactions/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, type, category, date, notes })
    });
    if (res.status === 201) {
        console.log(`Added ${type}: ${category} - $${amount}`);
    } else {
        console.error(`Failed to add ${type}:`, await res.text());
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log("Logging in...");
    const token = await login();
    if (!token) return;

    console.log("Generating realistic data...");
    const categoriesIncome = ["Salary", "Freelance", "Investments", "Bonus"];
    const categoriesExpense = ["Rent", "Groceries", "Utilities", "Entertainment", "Travel", "Healthcare", "Shopping", "Dining", "Software", "Coffee"];

    const today = new Date();
    
    // Generate data for the past 60 days
    for (let i = 60; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Chance to have income
        if (i % 15 === 0) {  
            await createTransaction(token, randomInt(3000, 5000), "income", "Salary", dateStr, "Bi-weekly paycheck");
        } else if (Math.random() < 0.1) {
            await createTransaction(token, randomInt(100, 1000), "income", categoriesIncome[randomInt(0, categoriesIncome.length - 1)], dateStr, "Side income");
        }

        // Daily expenses
        const numExpenses = randomInt(1, 5);
        for (let j = 0; j < numExpenses; j++) {
            await createTransaction(token, randomInt(10, 300), "expense", categoriesExpense[randomInt(0, categoriesExpense.length - 1)], dateStr, "");
        }
    }

    console.log("Data generation complete!");
}

main();
