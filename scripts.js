document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const locationSelect = document.getElementById('location');
    const addressInput = document.getElementById('address');
    const timeInput = document.getElementById('time');
    const hoursInput = document.getElementById('hours');
    const reservationsList = document.getElementById('reservationsList');
    const messageDiv = document.getElementById('message');
    let selectedSlot = null;

    let reservations = [
        {
            name: 'John Doe',
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

    function getEndTime(startTime, hours) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const endDate = new Date();
        endDate.setHours(startHours + hours, startMinutes, 0, 0);
        return endDate;
    }

    function displayReservations() {
        reservationsList.innerHTML = '';
        reservations.forEach(reservation => {
            const endTime = getEndTime(reservation.time, reservation.hours);
            const li = document.createElement('li');
            li.textContent = `${reservation.name} - ${reservation.address} ${reservation.licensePlate} - ${reservation.time} - ${reservation.hours} hour(s) (until ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
            reservationsList.appendChild(li);
        });
    }

    displayReservations();

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const licensePlate = document.getElementById('licensePlate').value;
        const time = timeInput.value;
        const hours = hoursInput.value;
        const address = document.getElementById('address').value;

        const now = new Date();
        const startTime = new Date();
        const [startHours, startMinutes] = time.split(':').map(Number);
        startTime.setHours(startHours, startMinutes, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(startHours + parseInt(hours), startMinutes, 0, 0);
        
        const reservation = {
            name,
            licensePlate,
            time,
            address,
            hours: parseInt(hours)
        };

        
        reservations.push(reservation);
        
        displayReservations();
        

        form.reset();
        messageDiv.textContent = 'Reservation successful!';
    });

    const parkingLocations = [
        { id: '1', name: 'MG Road Parking', lat: 12.972442, lon: 77.580643, address: 'MG Road, Bangalore, Karnataka', slotsAvailable: 5 },
        { id: '2', name: 'Indiranagar Parking', lat: 12.9738, lon: 77.6407, address: 'Indiranagar, Bangalore, Karnataka', slotsAvailable: 6 },
        { id: '3', name: 'Jayanagar Parking', lat: 12.9287, lon: 77.5821, address: 'Jayanagar, Bangalore, Karnataka', slotsAvailable: 6 },
        { id: '4', name: 'Marina Beach Parking', lat: 13.0488, lon: 80.2777, address: 'Marina Beach, Chennai, Tamil Nadu', slotsAvailable: 6 },
        { id: '5', name: 'City Center Parking', lat: 19.0170, lon: 72.8562, address: 'City Center, Mumbai, Maharashtra', slotsAvailable: 6 },
        { id: '6', name: 'Charminar Parking', lat: 17.3616, lon: 78.4747, address: 'Charminar, Hyderabad, Telangana', slotsAvailable: 6 },
        { id: '7', name: 'Connaught Place Parking', lat: 28.6315, lon: 77.2167, address: 'Connaught Place, New Delhi', slotsAvailable: 6 },
        { id: '8', name: 'Baga Beach Parking', lat: 15.5505, lon: 73.7551, address: 'Baga Beach, Goa', slotsAvailable: 6 },
        { id: '9', name: 'Park Street Parking', lat: 22.5581, lon: 88.3521, address: 'Park Street, Kolkata, West Bengal', slotsAvailable: 6 },
        { id: '10', name: 'Marine Drive Parking', lat: 18.9397, lon: 72.8246, address: 'Marine Drive, Kochi, Kerala', slotsAvailable: 6 }
    ];

    parkingLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.id;
        option.textContent = location.name;
        locationSelect.appendChild(option);
    });

    const map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const greenIcon = L.icon({
        iconUrl: 'images/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                L.marker([latitude, longitude], { icon: greenIcon }).addTo(map);
            },
            error => {
                console.error('Error getting location:', error);
                alert('Error getting your location. Please make sure you have allowed location access.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }

    parkingLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lon]).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>Address: ${location.address}<br>Slots Available: ${location.slotsAvailable}`);
        marker.on('mouseover', function () {
            marker.openPopup();
        });
        marker.on('mouseout', function () {
            marker.closePopup();
        });
        marker.on('click', () => {
            locationSelect.value = location.id;
            addressInput.value = location.address;
            selectedSlot = null;
            slotButtonsContainer.innerHTML = '';
            updateSlotButtons();
        });
    });

    locationSelect.addEventListener('change', () => {
        const selectedLocation = parkingLocations.find(loc => loc.id === locationSelect.value);
        if (selectedLocation) {
            addressInput.value = selectedLocation.address;
            selectedSlot = null;
            slotButtonsContainer.innerHTML = '';
            updateSlotButtons();
        } else {
            addressInput.value = '';
            slotButtonsContainer.innerHTML = '';
        }
    });

    timeInput.addEventListener('change', updateSlotButtons);
    hoursInput.addEventListener('input', updateSlotButtons);

})
