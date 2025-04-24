# Resource Center - Armon Empire

Welcome to the Resource Center for the Armon Empire Barbershop website. This document provides an overview of the project architecture, tech stack, hosting details, and key integrations used to deliver a modern, scalable, and highly interactive web experience.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Hosting](#hosting)
- [Stripe Integration](#stripe-integration)
- [Acuity Scheduling Integration](#acuity-scheduling-integration)
- [Real-Time Check-In System](#real-time-check-in-system)
- [Google Maps Integration](#google-maps-integration)
- [Additional Information and Best Practices](#additional-information-and-best-practices)
- [Conclusion](#conclusion)

---

## Overview

Armon Empire is a comprehensive barbershop website designed to manage appointments, process payments, and handle customer check-ins efficiently. The application leverages modern web technologies and integrates with several third-party services to ensure a seamless user experience for both customers and staff.

---

## Tech Stack

- **Client:** React, Vite, TypeScript  
- **Server:** Node.js, Express, MongoDB  
- **Database:** MongoDB Atlas  
- **Third-Party Integrations:**
  - **Stripe:** For payments and subscription management.
  - **Acuity Scheduling (via Squarespace):** For booking and managing appointments.
  - **Web Sockets:** For real-time check-in notifications in our PWA.
  - **Google Maps API:** For embedding an interactive map displaying our barbershop's location.

---

## Hosting

- **Client Hosting:** Vercel  
- **Server Hosting:** Render  
- **Database Hosting:** MongoDB Atlas  

---

## Stripe Integration

Our website uses Stripe to handle payments, subscriptions, and billing. Key aspects include:

- **Embedded Payment Processing:**  
  Customers can make payments directly on our site using an embedded payment form.

- **Subscription Management via Webhooks:**  
  The following Stripe webhook events are used to keep our database in sync with Stripe:
  
  - **`customer.subscription.deleted`**  
    Updates the user's subscription status to "Cancelled" in our database.
    
  - **`customer.subscription.updated`**  
    Checks for status changes (e.g., moving to "past_due") and updates the database accordingly.
    
  - **`invoice.payment_failed`**  
    Flags the user's payment status as "past_due" to prompt an update in payment information.
    
  - **`invoice.payment_succeeded`**  
    Sets the user's payment status to "active" when payments go through successfully.

- **Data Sync:**  
  Whenever a Stripe event occurs, our webhook handler updates the relevant user record to reflect the current subscription and payment status. This ensures that billing, service provision, and customer notifications are always up-to-date.

---

## Acuity Scheduling Integration

Acuity Scheduling, integrated via Squarespace, is employed for managing appointments. Key functionalities include:

- **Appointment Webhooks:**  
  Whenever an appointment is created or edited, Acuity Scheduling sends a webhook to our server.
  
- **User Matching:**  
  The backend attempts to match the appointment with an existing user based on the email or phone number provided during booking.
  
- **Handling Errors:**  
  Since user input errors (e.g., typos) may result in failures to match appointments, these issues are logged. Currently, there is no automated resolution for mismatches, and they require manual review.

---

## Real-Time Check-In System

Our system incorporates a Progressive Web App (PWA) designed for customer check-ins. Key components include:

- **Web Sockets for Real-Time Communication:**  
  The check-in app utilizes web sockets to establish a real-time connection between the frontend PWA and the server. This allows:
  - Immediate updates when a customer checks in.
  - Real-time notifications to the staff about the current waitlist and appointment statuses.
  - Reduced latency compared to traditional HTTP polling, ensuring a smooth user experience.

- **PWA Benefits:**  
  The check-in application:
  - Works offline to an extent, allowing for continuous operation even in low-connectivity scenarios.
  - Provides a mobile-friendly experience for customers as they arrive at the barbershop.
  - Leverages caching, background sync, and push notifications to enhance interactivity.

---

## Google Maps Integration

To assist customers with location-based services, the website includes an embedded Google Map:

- **Google Maps API:**  
  A Google API key is used to load and display the map. The map provides:
  - An interactive view of the barbershop's location.
  - Zoom and pan capabilities so users can explore nearby landmarks.
  - Directions and route planning to improve accessibility.

- **Enhanced User Experience:**  
  Embedding Google Maps not only aids in navigation but also reinforces brand presence by visually showcasing the physical location of the barbershop.

---

## Additional Information and Best Practices

- **Environment Variables:**  
  All sensitive configuration (API keys, database URIs, Stripe secrets) is managed through environment variables, enhancing security and configurability across environments.

- **Version Control and CI/CD:**  
  Our codebase is version-controlled using Git. Deployment pipelines (via Vercel for the client and Render for the server) ensure seamless continuous integration and deployment.

- **Monitoring and Logging:**  
  Both client and server applications are integrated with logging and monitoring tools to track performance, errors, and real-time events (including webhooks).

- **Security Measures:**  
  - Webhook signature verification is enforced to ensure authenticity of incoming events from Stripe.
  - Best practices such as secure dependency management, HTTPS, and proper CORS configurations are in place.

- **Scalability:**  
  The architecture is designed to scale horizontally, and MongoDB Atlas provides robust data management with built-in replication and sharding capabilities.

---

## Conclusion

The Armon Empire barbershop website is a modern, feature-rich application combining a state-of-the-art tech stack with robust third-party service integrations. By leveraging technologies like React, Node.js, MongoDB, Stripe, Acuity Scheduling, web sockets, and Google Maps, the system delivers a seamless experience—from secure payments and real-time check-ins to effective appointment management and location services. Continuous monitoring, security best practices, and a flexible cloud-hosted infrastructure ensure that Armon Empire can scale and adapt to future needs while providing exceptional service to customers.

---

*For more details, please refer to the repository documentation or contact the development team.*
