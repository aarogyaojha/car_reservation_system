// Retrieve total amount from localStorage
var totalAmount = localStorage.getItem("totalAmount");

// Update total amount on payment page
var totalAmountElement = document.getElementById("totalAmount");
if (totalAmount) {
    totalAmountElement.innerText = "Rs." + totalAmount;
}
