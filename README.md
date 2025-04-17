<div align="center">
  
# 🔥 Late Night BBQ: Website & Admin Dashboard

![download](https://github.com/user-attachments/assets/28ff98f5-86c8-49cb-9712-ebbc05e11616)



**Late Night BBQ** is a modern, bilingual content-managed website and admin dashboard built for a beloved BBQ catering business in Houston, Texas. Our mission was to honor their story while giving them full ownership over their digital presence.

</div>

## We designed and built a people-first, tech-forward solution that:

- Lets the business showcase their menu, merch, story, and community love
- Allows customers to explore the business in English or Spanish
- Supports secure content editing through a custom-built admin dashboard
- Shares authentic community voices through testimonials
- Delivers a fast, accessible, and scalable experience with modern tools

**This project empowers the business to:**
- Update homepage banners, menu items, testimonials, about page content, and merch directly
- Receive order requests through a dynamic contact form linked via Resend

**And it lets visitors:**
- Navigate a warm, modern site in English or Spanish
- Explore the story, food, and love behind the business

Built with **Next.js**, **Firebase**, and **Vercel**, this app reflects both the soul of the brand and the strength of modern web technology.

---

## Core Sections

### 1. Public Website
Mobile responsive and fully bilingual (EN/ES)

- **Homepage** – Banner (admin-editable), intro content, and Facebook embed.
- **About Page** – Featuring "About the Pitmaster" (editable) and "About the Developers" (hardcoded)
- **Menu Page** – Categorized menu items with images and descriptions (admin-controlled)
- **Merch Page** – Merchandise display with images and descriptions (admin-controlled)
- **Testimonials Page** – Community reviews and love.
- **Contact Us Page** – Order request form powered by [Resend](https://resend.com/) for email delivery

> All dynamic content is editable through the admin dashboard and supports both English and Spanish versions.
![espanolcontact](https://github.com/user-attachments/assets/645e3ac1-59fb-4062-8cca-e03964844922)
![espanolcontact2](https://github.com/user-attachments/assets/d022e271-1bb9-4924-b8ee-88bb7af1f5be)



---

### 2. Admin Dashboard
Accessible only to the business owners via secure login with Firebase Auth.

-  **Homepage Banner Editor** – Upload and switch between multiple banners
-  **About the Pitmaster Editor** – Modify text content and pitmaster image
-  **Menu Manager** – Add, edit, delete, crop images, reorder categories (BBQ Meats, Sides, Fixins)
-  **Merch Manager** – Upload merch items, images, multilingual descriptions, drag to reorder
-  **Testimonials** – Curate community testimonials and highlight feedback

> Admins use a simple, intuitive interface powered by drag-and-drop, modals, and secure API routes backed by Firebase.
![adminmenu](https://github.com/user-attachments/assets/0645aeeb-41dc-432f-b455-07dbefe211f5)
![adminmenu2](https://github.com/user-attachments/assets/69c053d0-c670-4c77-b696-9ec233046a3a)
![adminmenu3](https://github.com/user-attachments/assets/c3888385-8780-435b-b044-5a1671c4654a)







---

##  Tech Stack

| Area               | Tool / Library                     | Why                                         |
| ------------------|-------------------------------------|---------------------------------------------|
| Frontend          | React + TypeScript                  | Modern, scalable, type-safe UI              |
| Framework         | Next.js (App Router)                | Server & client logic in one place          |
| Styling           | Tailwind CSS v4                     | Fast, responsive design                     |
| Admin CMS         | Firebase Admin SDK + Firestore     | Secure, real-time updates                   |
| Authentication    | Firebase Auth                      | Secure login for admin dashboard            |
| Storage           | Firebase Storage + Admin SDK       | Handles image upload and public URLs        |
| Email             | Resend                              | Reliable, secure form-to-inbox flow         |
| Translations      | react-i18next                       | EN/ES support for both static and dynamic   |
| Drag + Crop       | hello-pangea/dnd, react-easy-crop   | Custom drag-and-drop and image cropping     |
| Deployment        | Vercel                              | One-click deploy, great DX, CI/CD           |

---

## How Everything Connects

### Public Site Flow:
Visitor chooses language → Browses homepage → Views about, menu, merch, and testimonials → Sends an order request via contact form

### Admin Flow:
Admin logs in → Navigates dashboard → Edits banners, menu, merch, about section, and testimonials → Changes go live instantly

---

## Security & Privacy

- Admin routes are fully protected by Firebase Auth token verification
- Only authenticated users can upload, delete, or update site content
- Firebase Admin SDK used for all backend operations (Firestore and Storage)
- Email and form submissions do not expose sensitive user data

---

### 💖 Made with love by:

- **[Vie P.](https://whatdoyouknowaboutlove.com/viep/)** —  Lead Full Stack Engineer & Bilingual UX Contributor  
- **[Courtney G.](https://github.com/grahacr)** — Full Stack Engineer & Visual Interaction Developer  
- **[Starlee J.](https://github.com/starles-barkley)** — Project Manager & Quality Assurance




