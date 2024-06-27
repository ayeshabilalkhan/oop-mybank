#! /usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
// Bank Account Class
class BankAccount {
    accountNumber;
    balance;
    constructor(accountNumber, balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }
    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`);
        }
        else {
            console.log("Insufficient balance.");
        }
    }
    deposit(amount) {
        if (amount > 100) {
            amount -= 1; //$1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        console.log(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`);
    }
    checkBalance() {
        console.log(`Current Balance: $${this.balance}`);
    }
}
// Customer Class
class Customer {
    firstName;
    lastName;
    gender;
    age;
    mobileNumber;
    account;
    constructor(firstName, lastName, gender, age, mobileNumber, account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}
// Create Bank Accounts
const accounts = [
    new BankAccount(1001, 500),
    new BankAccount(1002, 1000),
    new BankAccount(1003, 2000),
    new BankAccount(1004, 5000),
    new BankAccount(1005, 3000)
];
// Create Customers
const customers = [
    new Customer("Imran", "Khan", "Male", 30, 3146754982, accounts[0]),
    new Customer("Hasnain", "Siraj", "Male", 25, 3219673210, accounts[1]),
    new Customer("Sara", "Khan", "Female", 27, 3336739336, accounts[2]),
    new Customer("Rimsha", "Daniyal", "Female", 22, 3008764437, accounts[3]),
    new Customer("Muzammil", "Imran", "Male", 23, 3170086400, accounts[4]),
];
// Function to interact with bank account
async function service() {
    do {
        const { accountNumber } = await inquirer.prompt({
            name: "accountNumber",
            type: "number",
            message: chalk.green("Enter your account number: (1001 to 1005)")
        });
        const customer = customers.find(customer => customer.account.accountNumber === accountNumber);
        if (customer) {
            console.log(`Welcome, ${customer.firstName} ${customer.lastName}\n`);
            const ans = await inquirer.prompt([{
                    name: "select",
                    type: "list",
                    message: "Select an operation",
                    choices: ["Deposit", "Withdraw", "Check Balance", "Exit"]
                }]);
            switch (ans.select) {
                // Example of input validation for deposit amount
                case "Deposit":
                    const depositPrompt = await inquirer.prompt({
                        name: "amount",
                        type: "number",
                        message: chalk.greenBright("Enter the amount to deposit:"),
                        validate: (value) => {
                            if (isNaN(value) || value <= 0) {
                                return "Please enter a valid amount.";
                            }
                            return true;
                        }
                    });
                    customer.account.deposit(depositPrompt.amount);
                    break;
                case "Withdraw":
                    const withdrawAmount = await inquirer.prompt({
                        name: "amount",
                        type: "number",
                        message: chalk.greenBright("Enter the amount to withdraw:")
                    });
                    customer.account.withdraw(withdrawAmount.amount);
                    break;
                case "Check Balance":
                    customer.account.checkBalance();
                    break;
                case "Exit":
                    console.log(chalk.red("Exiting Bank Program.. ."));
                    console.log(chalk.yellow("\n Thank you for using our bank services. Have a good day!"));
                    return;
            }
        }
        else {
            console.log(chalk.bold.red("Customer not found. Please enter a valid account number."));
        }
    } while (true);
}
// Start the service function to interact with the bank accounts
service();
