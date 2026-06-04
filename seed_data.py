import requests
import random
import datetime

API_URL = "http://localhost:3001"

def login():
    res = requests.post(f"{API_URL}/auth/login", json={
        "email": "admin@finance.com",
        "password": "Admin@123"
    })
    if res.status_code == 200:
        return res.json()["data"]["accessToken"]
    else:
        print("Login failed:", res.text)
        return None

def create_transaction(token, amount, t_type, category, date, notes=""):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "amount": amount,
        "type": t_type,
        "category": category,
        "date": date,
        "notes": notes
    }
    res = requests.post(f"{API_URL}/transactions/", json=data, headers=headers)
    if res.status_code == 201:
        print(f"Added {t_type}: {category} - {amount}")
    else:
        print(f"Failed to add {t_type}:", res.text)

def main():
    print("Logging in...")
    token = login()
    if not token:
        return

    print("Generating realistic data...")
    categories_income = ["Salary", "Freelance", "Investments", "Bonus"]
    categories_expense = ["Rent", "Groceries", "Utilities", "Entertainment", "Travel", "Healthcare", "Shopping", "Dining"]

    today = datetime.date.today()
    
    # Generate data for the past 60 days
    for i in range(60, -1, -1):
        date_str = (today - datetime.timedelta(days=i)).isoformat()
        
        # Chance to have income
        if i % 15 == 0:  # e.g., bi-weekly salary
            create_transaction(token, random.randint(3000, 5000), "income", "Salary", date_str, "Bi-weekly paycheck")
        elif random.random() < 0.1:
            create_transaction(token, random.randint(100, 1000), "income", random.choice(categories_income), date_str, "Side income")

        # Daily expenses
        num_expenses = random.randint(1, 4)
        for _ in range(num_expenses):
            create_transaction(token, random.randint(10, 200), "expense", random.choice(categories_expense), date_str, "")

    print("Data generation complete!")

if __name__ == "__main__":
    main()
