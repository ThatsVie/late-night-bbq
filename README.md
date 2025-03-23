# 🔥 Late Night BBQ — Website & Admin Dashboard

## Purpose

To build a beautiful, accessible, bilingual website for a small BBQ delivery business in Houston. It will:

- Help users place orders, and leave reviews
- Give admins a dashboard to manage users, track orders, and view metrics
- Reflect the warmth, connection, and reputation the couple has built in their community

---

## Core Sections

### 1. Public Website

- Homepage
- About the business / couple
- Testimonials
- Storefront (Order / Merch options)
- Booking calendar (embed or custom)

**How:** Built with React + TypeScript, deployed on Vercel  
**Why:** Fast, responsive, accessible, bilingual — all publicly visible and mobile-friendly

---

### 2. Authentication

- Create account (name, email, phone, password)
- Email verification
- 2-step authentication (via email or phone)
- Login / logout
- Role: user vs admin

**How:** Use Firebase Auth  
**Why:** Secure, easy to integrate, handles 2FA, and reduces need to manage passwords manually

---

### 3. User-Specific Functionality (after login)

- Place an order (submit form + pay with Stripe)
- Leave a review / testimonial
- View order history
- Profile management

**How:** React UI + serverless API routes on Vercel, connected to PostgreSQL + Stripe  
**Why:** Allows users to interact meaningfully while keeping sensitive actions behind auth

---

### 4. Admin Dashboard

- View all orders and filter/search
- View and manage user data
- View submitted reviews
- Access metrics (site visits, order stats, revenue)
- Possibly export data or manage booking schedule

**How:** Protected admin route in React app + backend API endpoints  
**Why:** Enables the couple to manage the business without needing external tools

---

## Tech Stack

| Area                 | Tool                            | Why                                       |
| -------------------- | ------------------------------- | ----------------------------------------- |
| Frontend             | React + TypeScript              | Robust, scalable, modern                  |
| Styling              | Tailwind CSS                    | Responsive, accessible, fast to build     |
| Routing & API        | Next.js (App Router)            | Pages + backend routes together on Vercel |
| Auth                 | Firebase Auth                   | 2FA, email verification, secure login     |
| Backend Logic        | Vercel Serverless Functions     | Keep frontend + backend in one place      |
| Database             | PostgreSQL                      | Perfect for orders, users, admin data     |
| Payments             | Stripe API                      | Secure, scalable payment processing       |
| Booking              | Calendly API or Google Calendar | Easily syncs bookings to owner's calendar |
| Analytics            | Google Analytics or Plausible   | Track user activity and traffic           |
| Internationalization | react-i18next                   | Clean multilingual content (EN/ES)        |
| Deployment           | Vercel                          | One-click deploy, CI/CD, easy scaling     |

---

## How Everything Connects

### Public Flow:

Visitor arrives → picks language → browses homepage → signs up/logs in → places order → pays with Stripe → gets confirmation

### Admin Flow:

Logs in with admin account → accesses dashboard → sees orders, reviews, users, bookings, metrics → handles customer interactions

---

## Security & Privacy

- All sensitive actions (place order, leave review, view dashboard) require authentication
- Firebase ensures email is verified and 2FA is used
- Backend serverless functions verify Firebase tokens before interacting with the database
- Stripe handles all payment data — no card data touches your server
- Role-based routing and API protection ensures only admins can access dashboard content

---

## Development Roadmap

| Phase   | Focus                                                  |
| ------- | ------------------------------------------------------ |
| Phase 1 | Plan layout, pages, content, and translations          |
| Phase 2 | Set up Firebase Auth, user roles, and protected routes |
| Phase 3 | Build core UI: homepage, about, order form, booking    |
| Phase 4 | Integrate Stripe payments and store order data in DB   |
| Phase 5 | Build and secure admin dashboard                       |
| Phase 6 | Add i18n, responsive/mobile enhancements, final polish |
| Phase 7 | Launch and monitor analytics, collect feedback         |

---

## Special Touches (Emotional + Personal Goals)

- Tell the couple’s story on the About page (photos, quotes, timeline)
- Highlight community love (testimonial wall or interactive map)
- Add developer "about me" page showing how tech brings people together
- Stick to neon pink and black, but add warmth (shadows, textures, natural tones)
- Use hand-drawn or brush-style fonts and cozy imagery

---

## What We're Building & Why

We're creating:

A community-first, modern, bilingual web app that allows:

- Customers to order food and leave love
- The business to manage everything in one place

Using the right tools to make it:

- Beautiful (Tailwind + imagery)
- Functional (React + PostgreSQL + Stripe)
- Secure (Firebase + serverless backend)
- Human (storytelling + accessibility + multilingual)

All deployed together via Vercel
