# InterPrep - AI Interview Mock App

A modern web application that helps users practice job interviews using AI-powered questions and real-time feedback. Built with Next.js, featuring speech-to-text recording, webcam integration, and intelligent feedback generation.

## 🚀 Features

- **AI-Generated Interview Questions**: Get personalized interview questions based on job position, description, and experience level
- **Speech-to-Text Recording**: Record your answers using your microphone with real-time transcription
- **Webcam Integration**: Practice with video recording for a realistic interview experience
- **Real-time Feedback**: Receive instant AI-powered feedback on your answers with ratings and improvement suggestions
- **User Authentication**: Secure login/signup using Clerk authentication
- **Interview History**: Track and review your previous mock interviews
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI
- **Speech Recognition**: react-hook-speech-to-text
- **Video Recording**: react-webcam
- **UI Components**: Radix UI, Lucide React icons
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- A Google Gemini AI API key
- A Neon PostgreSQL database
- A Clerk account for authentication

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd InterPrep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database
   NEXT_PUBLIC_DRIZZLE_DB_URL=your_neon_database_url

   # Google Gemini AI
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

   # App Configuration
   NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=5
   NEXT_PUBLIC_QUESTION_NOTE=Speak clearly and provide detailed answers for better feedback.
   NEXT_PUBLIC_INFORMATION=Make sure your microphone and camera are working properly before starting the interview.
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### 1. **Sign Up/Login**
- Create an account or sign in using Clerk authentication
- You'll be redirected to the dashboard after successful authentication

### 2. **Create a New Interview**
- Click on the "+ Add New" card on the dashboard
- Fill in the job details:
  - Job Role (e.g., "Full Stack Developer")
  - Job Description/Tech Stack (e.g., "React, Node.js, PostgreSQL")
  - Years of Experience
- Click "Start Interview" to generate AI-powered questions

### 3. **Take the Interview**
- Review the interview details and information
- Click "Start Interview" to begin
- For each question:
  - Read or listen to the question (text-to-speech available)
  - Click "Record Answer" to start recording your response
  - Speak clearly into your microphone
  - Click "Stop Recording" when finished
  - Review your transcribed answer
  - Proceed to the next question

### 4. **Review Feedback**
- After completing all questions, view your detailed feedback
- Each answer includes:
  - Your recorded response
  - The correct/expected answer
  - AI-generated rating
  - Improvement suggestions

**Happy Interviewing! 🎉**
