# Reception Management Dashboard

## Project Overview 

This project is a web application for managing staff and delivery drivers for a company called WeDeliverTech. The application allows for tracking and setting the status of staff members by the receptionist as well as managing and scheduling delivires. 

## File Structure

This project consists mainly of three files.

- app_wdt.html: HTML file used for opening and using the web application - ```'SP1-CA\Web Application\wdt_app.html'``` 

- app_wdt.js: JavaScript file containing all the logic to supplement the HTML file - ```'SP1-CA\Web Application\wdt_app.js'```

- app_wdt.css: CSS file containing most of the styling for the application, some styling is part of the external links - ```'SP1-CA\Web Application\wdt_app.css'```

**Important to note: If the applications is not running properly, remember to change the filepath to match where the repository has been cloned to.**

## External Libraries & Plugins

This project uses several external libraries and plugins, which are directly linked in the 'wdt_app.html'. 

- Bootstrap v5.3.2: Used for design and UI elements - For more details check out: https://getbootstrap.com/
- jQuery v3.6.0: Used for DOM manipulation and AJAX calls - For more details check out: https://jquery.com/
- SweetAlert2: Used to enhance alerts and prompt boxes - For more details check out: https://sweetalert2.github.io/
- Bootstrap-select v1.14.0-beta2: Used for custom select input styling - For more details check out: https://www.jsdelivr.com/package/npm/bootstrap-select
- Bootstrap Icons: Used for adding UI icons - For more details check out: https://icons.getbootstrap.com/

**Important to note: All the external libraries and plugins are directly linked and do not need to be installed locally. It is however important to follow the structure and hierarchy in the HTML to allow them to function properly. Refer to the structure as showed below**


### Head Section
```html
<!DOCTYPE html>
<html lang='en'>
<head>
    <title>Reception Management Dashboard</title>
    <!-- Bootstrap and other external CSS links -->
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet' 
          integrity='sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN' crossorigin='anonymous'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css' rel='stylesheet'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.18/dist/css/bootstrap-select.min.css' rel='stylesheet'>
    <!-- Link to custom CSS file -->
    <link rel='stylesheet' href='wdt_app.css'>
</head>
```

### Body Section (End of body)
```html
<body>
<!-- External JS Libraries and Custom JS -->
    <script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
    <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js' 
            integrity='sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL' crossorigin='anonymous'></script>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta2/dist/js/bootstrap-select.min.js'></script>
    <!-- Custom JavaScript file -->
    <script src='wdt_app.js'></script>
</body>
```

## Running the Application

To run the web application, follow these steps:

1. Download/Clone the repository. 

2. Open the application by opening the `app_wdt.html` located in the Web Application folder. 

3. Use the application to manage staff members and deliveries. 

## Usage Notes

- The web application is designed to run with modern browser without any additional installations. 

- As the application uses external libraries and plugins, it is crucial to maintain an active internet connection for the application to function properly.

## Contributing

- Ruben Gillebo Kjær 