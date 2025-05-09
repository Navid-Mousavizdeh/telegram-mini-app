# Mini Telegram App

A Next.js-based application mimicking a simplified version of Telegram, allowing users to submit messages via a form and view registered data. The app includes form handling, basic authentication, and real-time updates, styled with Material-UI.

## Features
- **Form Handling**: Submit messages with fields for title, description, category, and image URL, managed with React-Hook-Form and validated using Zod.
- **Data Display**: View all submitted messages in a responsive table with pagination.
- **Authentication**: Basic JWT-based login/signup system.
- **Real-Time Updates**: New submissions are reflected in real-time using React Query.
- **Backend**: Next.js API routes handle form submissions and data retrieval, with data stored in a MongoDB.
- **Role-Based Access**: Admin users can view all messages; regular users can only submit and view.

## Tech Stack
- **Frontend**: Next.js, Material-UI, React-Hook-Form, Zod
- **Backend**: Next.js API Routes, Mongodb
- **Authentication**: JWT (using `jsonwebtoken`)
- **Deployment**: Vercel

## Prerequisites
- Node.js (>= 18.x)
- npm or yarn
- Git

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mini-telegram-app.git
   cd mini-telegram-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=./database
   ```
   - Replace `your_jwt_secret_key` with a secure random string for JWT signing.
   - The `DATABASE_URL` points to the mongodb database.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```
   or
   ```bash
   yarn build
   yarn start
   ```

## Deployment
Deployed on Vercel: [https://telegram-mini-app-nu-orcin.vercel.app/](https://telegram-mini-app-nu-orcin.vercel.app/)
## Telegram Bot Integration
A Telegram bot complements the app for form submissions: [https://t.me/fanap_infrap_entry_bot](https://t.me/fanap_infrap_entry_bot).