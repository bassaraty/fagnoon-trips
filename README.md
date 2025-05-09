# Fagnoon Monolith: Trip & Birthday Reservation System

## Project Overview

This project is a monolithic application for Fagnoon, designed to handle trip and birthday reservations. It is built using Laravel 11 and Vite for the frontend asset bundling.

## New Features Implemented

The following key features have been implemented in this version of the system:

- **Comprehensive CRUD Operations**: Full Create, Read, Update, and Delete functionalities for both Trips and Birthday reservations.
- **Advanced Booking Rules**: 
    - Enforced limits on package and activity selections.
    - Implemented location-blocking rules to prevent double bookings (e.g., "one booking per location per day" for certain event types).
- **File Uploads**:
    - Users can upload payment slips for their reservations.
    - Functionality for uploading feedback images has been added.
- **Real-time Attendee Check-in**: A system for real-time check-in of attendees for events, capturing name, phone, adult/kid counts, and timestamp.
- **Notifications System**:
    - A notification bell icon displays the count of unread notifications.
    - Users can view a list of their notifications in a dropdown.
    - Notifications are generated for events like reservation creation, updates, and deletions.
    - Functionality to mark notifications as read (individually or all at once).
- **Automated Testing**: PHPUnit tests have been implemented for critical areas:
    - Authentication flow (registration, login, logout, failed login).
    - Reservation flow (creation, update, deletion, validation failures, conflict scenarios).

## Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install PHP Dependencies**:
    ```bash
    composer install
    ```
3.  **Install JavaScript Dependencies**:
    ```bash
    npm install
    ```
4.  **Build Frontend Assets**:
    ```bash
    npm run build
    ```
5.  **Set Up Environment File**:
    Copy the example environment file and generate an application key.
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Ensure you configure your database connection details in the `.env` file (e.g., for MySQL, PostgreSQL, or SQLite). For SQLite, you might need to create the database file: `touch database/database.sqlite`.*

6.  **Run Database Migrations (and Seeders if available)**:
    ```bash
    php artisan migrate --seed
    ```
    *(The `--seed` flag will run database seeders if they are configured to populate initial data.)*

7.  **Serve the Application**:
    ```bash
    php artisan serve
    ```
    The application will typically be available at `http://127.0.0.1:8000`.

## API Endpoints

The following API endpoints are available. Most data-mutating endpoints and data-retrieval endpoints require authentication via Sanctum.

### Authentication

-   `POST /api/register`
    -   **Purpose**: Register a new user.
    -   **Params**: `name`, `email`, `password`, `password_confirmation`.
-   `POST /api/login`
    -   **Purpose**: Log in an existing user.
    -   **Params**: `email`, `password`.
-   `POST /api/logout` (Authenticated)
    -   **Purpose**: Log out the currently authenticated user.
-   `GET /api/user` (Authenticated)
    -   **Purpose**: Get details of the currently authenticated user.

### Reservations

-   `GET /api/reservations` (Authenticated)
    -   **Purpose**: List all reservations (likely for the authenticated user or admin).
-   `POST /api/reservations` (Authenticated)
    -   **Purpose**: Create a new reservation.
    -   **Params**: `user_id` (usually current user), `location_id`, `package_id`, `reservation_date`, `start_time`, `adult_count`, `kid_count`, `status`, `event_type`, `total_price`, etc.
-   `GET /api/reservations/{id}` (Authenticated)
    -   **Purpose**: Show details of a specific reservation.
-   `PUT/PATCH /api/reservations/{id}` (Authenticated)
    -   **Purpose**: Update an existing reservation.
    -   **Params**: Fields to update.
-   `DELETE /api/reservations/{id}` (Authenticated)
    -   **Purpose**: Delete a reservation.

### Birthdays

-   Follows standard RESTful resource patterns similar to Reservations (`/api/birthdays`).
-   `GET /api/birthdays`
-   `POST /api/birthdays`
-   `GET /api/birthdays/{id}`
-   `PUT/PATCH /api/birthdays/{id}`
-   `DELETE /api/birthdays/{id}`

### Locations

-   `GET /api/locations` (Authenticated, potentially public for listing)
    -   **Purpose**: List all locations.
-   `POST /api/locations` (Authenticated, admin likely)
    -   **Purpose**: Create a new location.
-   `GET /api/locations/{id}` (Authenticated)
    -   **Purpose**: Show details of a specific location.
-   `PUT/PATCH /api/locations/{id}` (Authenticated, admin likely)
    -   **Purpose**: Update an existing location.
-   `DELETE /api/locations/{id}` (Authenticated, admin likely)
    -   **Purpose**: Delete a location.

### Packages

-   Follows standard RESTful resource patterns similar to Locations (`/api/packages`).

### Activities

-   Follows standard RESTful resource patterns similar to Locations (`/api/activities`).

### Attendees

-   `GET /api/attendees` (Authenticated)
    -   **Purpose**: List attendees (e.g., for a specific reservation).
-   `POST /api/attendees` (Authenticated)
    -   **Purpose**: Create an attendee record (manual add).
-   `GET /api/attendees/{id}` (Authenticated)
    -   **Purpose**: Show details of a specific attendee.
-   `PUT/PATCH /api/attendees/{id}` (Authenticated)
    -   **Purpose**: Update an attendee record.
-   `DELETE /api/attendees/{id}` (Authenticated)
    -   **Purpose**: Delete an attendee record.
-   `POST /api/attendees/{attendee}/check-in` (Authenticated)
    -   **Purpose**: Perform real-time check-in for an attendee.
    -   **Params**: `name`, `phone`, `adult_count`, `kid_count` (if not already set or needs update).

### Notifications

-   `GET /api/notifications` (Authenticated)
    -   **Purpose**: List notifications for the authenticated user.
-   `GET /api/notifications/unread-count` (Authenticated)
    -   **Purpose**: Get the count of unread notifications for the user.
-   `POST /api/notifications/{notification}/mark-as-read` (Authenticated)
    -   **Purpose**: Mark a specific notification as read.
-   `POST /api/notifications/mark-all-as-read` (Authenticated)
    -   **Purpose**: Mark all unread notifications as read for the user.

### Payments

-   `GET /api/payments` (Authenticated)
    -   **Purpose**: List payments.
-   `POST /api/payments` (Authenticated)
    -   **Purpose**: Create a payment record.
-   `GET /api/payments/{id}` (Authenticated)
    -   **Purpose**: Show details of a specific payment.
-   `PUT/PATCH /api/payments/{id}` (Authenticated)
    -   **Purpose**: Update a payment record.
-   `DELETE /api/payments/{id}` (Authenticated)
    -   **Purpose**: Delete a payment record.
-   `POST /api/payments/{payment}/upload-slip` (Authenticated)
    -   **Purpose**: Upload a payment slip image for a specific payment.
    -   **Params**: File input (e.g., `payment_slip`).

### Feedback

-   `GET /api/feedback` (Authenticated)
    -   **Purpose**: List feedback entries.
-   `POST /api/feedback` (Authenticated)
    -   **Purpose**: Submit new feedback.
-   `GET /api/feedback/{id}` (Authenticated)
    -   **Purpose**: Show details of specific feedback.
-   `PUT/PATCH /api/feedback/{id}` (Authenticated)
    -   **Purpose**: Update feedback.
-   `DELETE /api/feedback/{id}` (Authenticated)
    -   **Purpose**: Delete feedback.
-   `POST /api/feedback/{feedback}/upload-image` (Authenticated)
    -   **Purpose**: Upload an image associated with feedback.
    -   **Params**: File input (e.g., `feedback_image`).

### Calendar & Card Views

-   `GET /api/calendar-view` (Authenticated)
    -   **Purpose**: Retrieve data formatted for a calendar view (e.g., reservations).
-   `GET /api/card-view` (Authenticated)
    -   **Purpose**: Retrieve data formatted for a card-based view.

### Admin Panel (Prefix: `/api/admin`)

-   All admin routes require authentication and appropriate admin role/permissions.
-   `GET, POST, PUT/PATCH, DELETE /api/admin/users`
-   `GET, POST, PUT/PATCH, DELETE /api/admin/locations`
-   `GET, POST, PUT/PATCH, DELETE /api/admin/packages`
-   `GET, POST, PUT/PATCH, DELETE /api/admin/activities`

## How to Run Tests

To run the automated PHPUnit tests, use the following Artisan command:

```bash
php artisan test
```

## Notes on Deployment

When deploying the application to a production environment, consider the following:

-   **Environment Variables**: 
    -   Ensure a `.env` file is present on the server and configured for the production environment.
    -   Set `APP_ENV=production`.
    -   Set `APP_DEBUG=false` to disable debug mode.
    -   Generate a new, secure `APP_KEY` specifically for the production environment.
    -   Configure database, cache, queue, mail, and other service credentials for production.
-   **Production Build**: 
    -   Run `npm run build` to generate optimized frontend assets.
-   **Composer Install**: 
    -   Run `composer install --optimize-autoloader --no-dev` for optimized class loading and to exclude development dependencies.
-   **Configuration Caching**: 
    -   Cache your configuration files for better performance: `php artisan config:cache`.
-   **Route Caching**: 
    -   Cache your routes for better performance: `php artisan route:cache`.
-   **View Caching** (Optional, if views are complex and not frequently changing):
    -   Cache your Blade views: `php artisan view:cache`.
-   **Permissions**: Ensure web server has write permissions to `storage` and `bootstrap/cache` directories.
-   **Queue Worker**: If using queues, ensure a queue worker process (e.g., Supervisor) is configured and running.
-   **Scheduler**: If using scheduled tasks, configure a cron job to run `php artisan schedule:run` every minute.
-   **Web Server Configuration**: Configure your web server (Nginx, Apache) to point to the `public` directory and handle requests appropriately (e.g., pretty URLs).

This README provides a comprehensive guide to understanding, setting up, and using the Fagnoon Monolith application.

