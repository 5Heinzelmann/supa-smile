# SupaSmile

A real-time web application for sharing jokes and collecting emoji reactions from users.

## Goal

SupaSmile is a playful web application that allows users to react to jokes with emojis in real-time. The application displays a current joke that can be changed by an admin, and users can react to the joke using various emoji reactions. All reactions are synchronized in real-time across all connected clients.

## Requirements

- **Next.js**: The application is built using Next.js with App Router
- **Supabase**: Backend services for database and real-time functionality
  - Note: Uses @supabase/supabase-js version ^2.49.7 due to a realtime bug in the latest version
- **Features**:
  - Real-time joke display with automatic updates
  - Emoji reactions with real-time synchronization
  - Simple admin interface to change the current joke
  - Reaction statistics display
- **Database**:
  - Jokes table: Stores joke text and tracks the current active joke
  - Reactions table: Stores emoji reactions and their counts for each joke

## Local Development

1. **Clone the repository**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
   - Copy your Supabase URL and anon key from the project settings > API
   - Create a `.env.local` file based on `.env.example` and add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Run the migrations in the `supabase/migrations` folder to set up your database schema

4. **Run the development server**
   ```
   npm run dev
   ```

5. **Access the application**
   - Main page: [http://localhost:3000](http://localhost:3000)
   - Admin interface: [http://localhost:3000/protected](http://localhost:3000/protected)