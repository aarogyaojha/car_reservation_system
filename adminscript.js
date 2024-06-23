const locationSelect = document.getElementById('location');
const customerSelect = document.getElementById('customer');
const buttonsContainer = document.getElementById('buttons-container');
const reserveButton = document.getElementById('reserve');
const reservationList = document.getElementById('reservation-list');

const customerName = document.getElementById('customer-name');
const customerLicensePlate = document.getElementById('customer-licensePlate');
const customerAddress = document.getElementById('customer-address');
const customerTime = document.getElementById('customer-time');
const customerHours = document.getElementById('customer-hours');

let selectedSlot = null;
const reservations = [];
const users = [
    {
        name: 'John Doe',
        licensePlate: 'ABC123',
        address: 'MG Road, Bangalore, Karnataka',
        time: '08:00',
        hours: 2
    },
    {
      name: 'Aarogya',
      licensePlate: 'ABC123',
      address: 'MG Road, Bangalore, Karnataka',
      time: '08:00',
      hours: 2
  },
    {
        name: 'Jane Smith',
        licensePlate: 'XYZ789',
        address: 'Indiranagar, Bangalore, Karnataka',
        time: '09:30',
        hours: 4
    },
    {
        name: 'Alice Johnson',
        licensePlate: 'JKL456',
        address: 'MG Road, Bangalore, Karnataka',
        time: '10:15',
        hours: 1
    }
];

const locations = [
  { name: '', slots: '' },
  { name: 'MG Road, Bangalore, Karnataka', slots: 6 },
  { name: 'Indiranagar, Bangalore, Karnataka', slots: 5 },
  { name: 'WhiteField, Bangalore, Karnataka', slots: 3 },
];

locations.forEach((location, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.innerText = `${location.name} (${location.slots})`;
  locationSelect.appendChild(option);
});

let filteredUsers = [];

locationSelect.addEventListener('change', (e) => {
  const locationIndex = e.target.value;
  const locationName = locations[locationIndex].name;

  filteredUsers = users.filter(user => user.address === locationName);
  customerSelect.innerHTML = '';

  filteredUsers.forEach((user, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = user.name;
    customerSelect.appendChild(option);
  });

  if (filteredUsers.length > 0) {
    updateCustomerDetails(filteredUsers[0]);
  }

  updateButtons();
});

customerSelect.addEventListener('change', (e) => {
  const selectedUserIndex = e.target.value;
  const selectedUser = filteredUsers[selectedUserIndex];
  updateCustomerDetails(selectedUser);
  updateButtons(); // Refresh buttons when customer changes
});

function updateCustomerDetails(user) {
  customerName.innerText = user.name;
  customerLicensePlate.innerText = user.licensePlate;
  customerAddress.innerText = user.address;
  customerTime.innerText = user.time;
  customerHours.innerText = user.hours;
}

function updateButtons() {
  buttonsContainer.innerHTML = '';
  selectedSlot = null;
  const locationIndex = locationSelect.value;
  const numberOfSlots = locations[locationIndex].slots;
  const bookedSlots = reservations
    .filter(reservation => reservation.locationIndex === parseInt(locationIndex))
    .map(reservation => ({ slot: reservation.slot, time: reservation.time, hours: reservation.hours }));

  for (let i = 1; i <= numberOfSlots; i++) {
    const button = document.createElement('button');
    button.innerText = `Slot ${i}`;
    const isBooked = bookedSlots.some(reservation => reservation.slot === i && hasTimeConflict(reservation.time, reservation.hours));

    if (isBooked) {
      button.classList.add('booked');
      button.disabled = true;
    } else {
      button.addEventListener('click', () => {
        if (selectedSlot) {
          selectedSlot.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedSlot = button;
      });
    }
    buttonsContainer.appendChild(button);
  }
}

function hasTimeConflict(reservationTime, reservationHours) {
  const [reservationHour, reservationMinute] = reservationTime.split(':').map(Number);
  const reservationEndTime = reservationHour + reservationHours;
  const selectedCustomerTime = customerTime.innerText;
  const selectedCustomerHours = parseInt(customerHours.innerText);

  const [customerHour, customerMinute] = selectedCustomerTime.split(':').map(Number);
  const customerEndTime = customerHour + selectedCustomerHours;

  return (
    (customerHour < reservationEndTime && customerEndTime > reservationHour) || // Overlapping times
    (reservationHour < customerEndTime && reservationEndTime > customerHour)    // Overlapping times
  );
}

reserveButton.addEventListener('click', () => {
  if (selectedSlot) {
    const locationIndex = locationSelect.value;
    const slotNumber = parseInt(selectedSlot.innerText.split(' ')[1]);
    const selectedCustomerIndex = customerSelect.value;
    const selectedCustomer = filteredUsers[selectedCustomerIndex];

    const existingReservation = reservations.find(reservation => reservation.customer === selectedCustomer.name);
    if (existingReservation) {
      alert("This customer already has a reservation.");
      return;
    }

    reservations.push({
      locationIndex: parseInt(locationIndex),
      slot: slotNumber,
      customer: selectedCustomer.name,
      licensePlate: selectedCustomer.licensePlate,
      time: selectedCustomer.time,
      hours: selectedCustomer.hours
    });

    localStorage.setItem('reservations', JSON.stringify(reservations));

    updateReservationList();

    selectedSlot = null;
    updateButtons();
  }
});

function updateReservationList() {
  reservationList.innerHTML = '';
  reservations.forEach(reservation => {
    const locationName = locations[reservation.locationIndex].name;
    const listItem = document.createElement('li');
    listItem.innerText = `${locationName} - Slot ${reservation.slot} (Reserved by ${reservation.customer})`;
    reservationList.appendChild(listItem);
  });
}

function populateUI() {
  const selectedLocationIndex = localStorage.getItem('selectedLocationIndex');
  if (selectedLocationIndex !== null) {
    locationSelect.selectedIndex = selectedLocationIndex;
  }
  updateButtons();
}

populateUI();
updateReservationList();
