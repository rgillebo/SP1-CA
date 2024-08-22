// Class Definitions
class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}

class StaffMember extends Employee {
    constructor(name, surname, picture, email) {
        super(name, surname);
        this.picture = picture;
        this.email = email;
        this.status = 'In'; // Default status
        this.outTime = '';
        this.duration = '';
        this.expectedReturnTime = '';
        this.notificationShown = false;
    }
}

class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, address, expectedReturnTime) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.address = address;
        this.expectedReturnTime = expectedReturnTime;
        this.notificationShown = false;
    }
}

// Global Variables
let staffData = [], deliveryDriversData = [];

// Custom Toast Configuration
const Toast = Swal.mixin({
    toast: true,
    position: 'center-end',
    showConfirmButton: false,
    showCloseButton: true,
    timer: null,
    icon: false, 
    customClass: {
        popup: 'custom-toast-popup',
        title: 'custom-toast-title',
        closeButton: 'custom-toast-close-button',
    }
});

// Document Ready Function
$(document).ready(function() {
    initializeEventListeners();
    staffUserGet();
    digitalClock();
    setInterval(staffMemberIsLate, 1000); 
    setInterval(deliveryDriverIsLate, 1000); 
});

// Initialize Event Listeners
function initializeEventListeners() {
    $('#staff tbody').on('click', 'tr', toggleRowSelection);
    $('#trackingTable tbody').on('click', 'tr', toggleRowSelection);
    $('#staff-out').on('click', staffOut);
    $('#staff-in').on('click', staffIn);
    $('#addDelivery').off('click').on('click', addDelivery); 
    $('#clearDelivery').on('click', clearDelivery);
    $(document).on('click', deselectOutsideClick);
    $('.tab.left').on('click', function() {
        // Navigate to the Dashboard page
        window.location.href = 'file:///C:/Users/ruben/github-classroom/noroff-backend-1/aug23ft-sp1-ca-rgillebo/Web%20Application/wdt_app.html'; // Remember to change local URL if needed
    });
}

// Fetch Staff Data
function staffUserGet() {
    $.ajax({
        url: 'https://randomuser.me/api/?results=5',
        dataType: 'json',
        success: processStaffResponse,
        error: function(xhr, status, error) {
            console.error('Error fetching staff data:', status, error);
        }
    });
}

// Process Staff Response
function processStaffResponse(data) {
    staffData = data.results.map(result => new StaffMember(result.name.first, result.name.last, result.picture.thumbnail, result.email));
    populateStaffTable();
}

// Populate Staff Table
function populateStaffTable() {
    const tableBody = $('#staff tbody').empty();
    staffData.forEach(staff => tableBody.append(createStaffRow(staff)));
}

// Create Staff Row
function createStaffRow(staff) {
    return $('<tr>').append(
        `<td><img src='${staff.picture}' alt='Profile Picture' width='50'></td>`,
        `<td>${staff.name}</td>`,
        `<td>${staff.surname}</td>`,
        `<td>${staff.email}</td>`,
        `<td>${staff.status}</td>`,
        formatTimeCell(staff.outTime),
        `<td>${staff.duration}</td>`,
        formatTimeCell(staff.expectedReturnTime)
    );
}

// Format Time Cell
function formatTimeCell(time) {
    return `<td>${time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>`;
}

// Staff Out Function
function staffOut() {
        if (!staffData) {
           console.error('Staff data is undefined');
           return;
       }
   
       const selectedRowIndex = $('#staff tbody tr.selected').index();
   
       if (selectedRowIndex === -1) {
           Swal.fire('Please select a staff member first.');
           return;
       }
   
       const selectedStaff = staffData[selectedRowIndex];
   
       if (selectedStaff.status === 'Out') {
        Swal.fire('Staff member is already clocked out.');
           return;
       }
   
        // SweetAlert prompt for duration
        Swal.fire({
            title: `Enter out-time for ${selectedStaff.name} in minutes:`,
            input: 'text',
            inputLabel: 'Please enter a number',
            inputPlaceholder: 'Example: 60',
            inputAttributes: {
            'aria-label': 'Example: 60'
            },
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || isNaN(value)) {
                    return 'Please enter a valid number!';
                }
            }
    }).then((result) => {
       if (result.isConfirmed) {
          const durationInMinutes = result.value;
   
       selectedStaff.status = 'Out';
       selectedStaff.outTime = new Date().toString(); 
       selectedStaff.duration = convertToHoursAndMinutes(durationInMinutes);
   
       const expectedReturn = new Date();
       expectedReturn.setMinutes(expectedReturn.getMinutes() + parseInt(durationInMinutes));
       selectedStaff.expectedReturnTime = expectedReturn.toString();
   
       selectedStaff.notificationShown = false; // Reset notification flag 
   
       populateStaffTable(staffData);
    
       Swal.fire('Clocked Out', `${selectedStaff.name} ${selectedStaff.surname} will be out-of-office for ${durationInMinutes} minutes.`, 'success');
    }
});
}
// Function to convert minutes into hours and minutes format
function convertToHoursAndMinutes(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    // Formatting the result as 'hours:minutes' string
    return `${hours} hr : ${minutes} min`;
    } 

// Staff In Function
function staffIn() {
    if (!staffData) {
        console.error('Staff data is undefined');
        return;
    }

    const selectedRowIndex = $('#staff tbody tr.selected').index();

    if (selectedRowIndex === -1) {
        Swal.fire('Please select a staff member first.');
        return;
    }

    const selectedStaff = staffData[selectedRowIndex];

    if (selectedStaff.status === 'In') {
        Swal.fire('Staff member is already clocked in.');
        return;
    }

    // Update staff status and reset related fields
    selectedStaff.status = 'In';
    selectedStaff.outTime = '';
    selectedStaff.duration = '';
    selectedStaff.expectedReturnTime = '';

    // Update the table with the new data
    populateStaffTable(staffData);
}

// Check Staff Late Function
function staffMemberIsLate() {
    const currentTime = new Date().getTime();

    staffData.forEach(staff => {
        if (staff.status === 'Out' && !staff.notificationShown) {
            const expectedReturnTime = new Date(staff.expectedReturnTime).getTime();

            if (currentTime > expectedReturnTime) {
                staffMemberIsLateNotification(staff);
                staff.notificationShown = true;
            }
        }
    });
}

// Show Notification Function
function staffMemberIsLateNotification(staffMember) {
    Toast.fire({
        title: 'Staff Delay Alert!',
        html: `<div class='toast-flex'>
                   <img src='${staffMember.picture}' alt='Profile' style='width: 50px; height: auto;'>
                   <div>${staffMember.name} ${staffMember.surname} is delayed</div>
               </div>
               <div class='toast-line-strong'><strong>Time out-of-office: ${staffMember.duration}</strong></div>
               <i class='bi bi-bell-fill'></i>`,
    });
}

// Show Custom Alert Function
function showAlert(message, example = '') {
    let htmlContent = '<div style="margin-bottom: 20px;">' + message + '</div>';
    let footerContent = '';

    if (example) {
        footerContent = '<div style="padding-top: 10px; font-size: 0.9em; color: #888;">Example: ' + example + '</div>';
    }

    Swal.fire({
        icon: 'error',
        title: 'Input Error',
        html: htmlContent,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        footer: footerContent, 
        customClass: {
            footer: 'custom-footer-class' 
        }
    });
} 

// Validate Delivery Function
function validateDelivery() {
    const vehicle = $('#vehicleInput').val().trim();
    const name = $('#nameInput').val().trim();
    const surname = $('#surnameInput').val().trim();
    const telephone = $('#telephoneInput').val().trim();
    const address = $('#addressInput').val().trim();
    const returnTime = $('#returnTimeInput').val().trim();

    let validationError = false;

    // Validate specific fields for correct format
    if (name && /[^a-zA-Z\s]/.test(name)) {
        showAlert('Invalid Name. Only letters are allowed.', 'Ola');
        validationError = true;
    } else if (surname && /[^a-zA-Z\s]/.test(surname)) {
        showAlert('Invalid Surname. Only letters are allowed.','Norman');
        validationError = true;
    } else if (telephone && !/^\d{7,}$/.test(telephone)) {
        showAlert('Invalid Telephone. Must be at least 7 digits & only digits.', '1234567');
        validationError = true;
    } else if (address && !(/(?=.*\d)(?=.*[a-zA-Z])/).test(address)) {
        showAlert('Invalid Address. Must contain both letters and digits.', 'University Rd 25');
        validationError = true;
    }

    // Check for missing fields
    if (!validationError) {
        let missingFields = [];
        if (!vehicle) missingFields.push('Vehicle');
        if (!name) missingFields.push('Name');
        if (!surname) missingFields.push('Surname');
        if (!telephone) missingFields.push('Telephone');
        if (!address) missingFields.push('Address');
        if (!returnTime) missingFields.push('Return Time');

        if (missingFields.length > 0) {
            let message = 'Please fill in the following fields: ' + missingFields.join(', ') + '.';
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: message,
            });
            return false;
        }
    }
    return !validationError;
}

// Add Delivery Function
function addDelivery(event) {
    event.preventDefault();

    if (!validateDelivery()) return;

    // Proceed with adding delivery data
    const vehicle = $('#vehicleInput').val().trim();
    const name = $('#nameInput').val().trim();
    const surname = $('#surnameInput').val().trim();
    const telephone = $('#telephoneInput').val().trim();
    const address = $('#addressInput').val().trim();
    const returnTime = $('#returnTimeInput').val().trim();
    const today = new Date();
    const [hours, minutes] = returnTime.split(':');
    const expectedReturn = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes), 0);
    const vehicleIconHtml = vehicle === 'Car' ? '<i class="bi bi-car-front-fill"></i>' : '<i class="bi bi-bicycle"></i>';

    // Create a new DeliveryDriver object
    const driver = new DeliveryDriver(name, surname, vehicle, telephone, address, expectedReturn.toString());
    deliveryDriversData.push(driver);

    // Update the delivery tracking table
    const newRow = $('<tr>');
    newRow.append(`<td>${vehicleIconHtml}</td>`, `<td>${name}</td>`, `<td>${surname}</td>`, `<td>${telephone}</td>`, `<td>${address}</td>`, `<td>${returnTime}</td>`);
    $('#trackingTable tbody').append(newRow);

    // Clear input fields after adding the delivery
    $('#nameInput').val('');
    $('#surnameInput').val('');
    $('#telephoneInput').val('');
    $('#addressInput').val('');
    $('#returnTimeInput').val('');
    $('.selectpicker').selectpicker('refresh');

    // Show success message
    const formattedReturnTime = expectedReturn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    Swal.fire({
        title: `Delivery for ${formattedReturnTime} added.`,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
    });
}

// Function for clearing delivery
function clearDelivery() {
    // Find the selected row in the delivery tracking table
    const selectedRow = $('#trackingTable tbody tr.selected');
    
    // Check if a row is selected
    if (selectedRow.length === 0) {
        Swal.fire('Please select a delivery to clear.');
        return;
    }

    // Confirmation dialog
    Swal.fire({
        title: 'Are you sure you want to clear this delivery?',
        text: 'Once removed, it cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
        if (result.isConfirmed) {

    // Get the index of the selected row
    const rowIndex = selectedRow.index();

    // Remove the corresponding entry from deliveryDriversData
    if (rowIndex > -1) {
        deliveryDriversData.splice(rowIndex, 1);
    }

    // Remove the selected row from the table
    selectedRow.remove();

    // Show a success message
    Swal.fire(
        'Cleared!',
        'The delivery has been cleared.',
        'success'
            );
        }
    });
}

// Check for Delivery late Function
function deliveryDriverIsLate() {
    const currentTime = new Date().getTime();

    deliveryDriversData.forEach(driver => {
        if (!driver.notificationShown) {
            const returnTime = new Date(driver.expectedReturnTime).getTime();
            if (currentTime > returnTime) {
                deliveryDriverIsLateNotificaton(driver);
                driver.notificationShown = true;
            }
        }
    });
}

// Show Notification Function
function deliveryDriverIsLateNotificaton(deliveryDriver) {
    // Parse the expectedReturnTime as a Date object
    const expectedReturnDate = new Date(deliveryDriver.expectedReturnTime);

    // Format the time as hours:minutes
    const formattedTime = expectedReturnDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    Toast.fire({
        title: 'Delivery Driver Delay Alert!',
        html: `<div class='toast-line'>Name: ${deliveryDriver.name} ${deliveryDriver.surname} is delayed.</div>
               <div class='toast-line'>Address: ${deliveryDriver.address}</div>
               <div class='toast-line'>Telephone: ${deliveryDriver.telephone}</div>
               <div class='toast-line-strong'><strong>Estimated Return: ${formattedTime}</strong></div>
               <i class='bi bi-bell-fill'></i>`,
    });
}

// Initialize Clock Function
function digitalClock() {
    function updateClock() {
        $('#clock').text(new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        }));
    }
    setInterval(updateClock, 1000);
    updateClock();
}

// Toggle Row Selection
function toggleRowSelection() {
    $(this).toggleClass('selected').siblings().removeClass('selected');
}

// Deselect Outside Click
function deselectOutsideClick(event) {
    if (!$(event.target).closest('.selected').length) $('.selected').removeClass('selected');
}

