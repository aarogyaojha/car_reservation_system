document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("paymentModal");
    const btn = document.getElementById("addMoneyBtn");
    const span = document.getElementsByClassName("close")[0];
    const form = document.getElementById("amountForm");
    const prebuiltAmounts = document.querySelectorAll('.prebuilt-amount');

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    prebuiltAmounts.forEach(button => {
        button.addEventListener('click', function () {
            const amount = this.dataset.amount;
            document.getElementById("amount").value = amount;
        });
    });

    form.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission
        const amount = document.getElementById("amount").value;
        localStorage.setItem("selectedAmount", amount);
        window.location.href = 'payment.html';
    }

    // Retrieve total amount from localStorage
    var totalAmount = localStorage.getItem("totalAmount");

    // Update total amount on wallet page
    var totalAmountElement = document.getElementById("totalAmount");
    if (totalAmount) {
        totalAmountElement.innerText = "₹" + totalAmount;
    }
});
