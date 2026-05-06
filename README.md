# 🚀 AI Codebase Navigator

A full-stack MERN SaaS application that analyzes GitHub repositories and provides AI-powered explanations of codebases.

---

## 🌐 Overview

AI Codebase Navigator helps developers:

- 🔗 Paste a GitHub repository URL
- 📁 Explore file/folder structure
- 🧠 Get AI-powered explanations of code
- 💬 Ask questions about the codebase

Built with a scalable backend and modern frontend to simulate a real SaaS product experience.

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login (JWT based)
- Protected routes
- Persistent login using localStorage

### 📂 Repository Analysis
- Analyze any public GitHub repository
- Fetch and display file/folder tree
- Collapsible file explorer

### 🧠 AI Code Explanation
- Explain selected files
 - Understand logic, flow, and dependencies 
 
### 💬 AI Chat Assistant 
 - Ask questions about the codebase 
 - Get contextual responses 
 
### 📊 Dashboard UI 
 - Sidebar navigation 
 - File explorer 
 - Explanation panel 
 - Chat interface 
---
## 🛠️ Tech Stack 
### Frontend 
* React (Vite) 
* Tailwind CSS 
* React Router 
* Axios 
### Backend 
* Node.js  
* Express.js  
* MongoDB (Mongoose)  
* JWT Authentication  
* MVC Architecture  
### AI Integration  
* Google Gemini / OpenAI (optional)
      * Mock fallback responses supported ---
  ## 📁 Project Structure ```
  server/ ├── config/
          ├── controllers/
          ├── models/
          ├── routes/
          ├── middleware/
          ├── utils/
  
   client/├── components/
          ├── pages/
          ├── services/ ``` ---
  
 ⚙️ Environment Variables
  * Create a `.env` file inside `server/`: ```
  * MONGO_URI=your_mongodb_uri
  * JWT_SECRET=your_secret_key
  * GITHUB_TOKEN=optional_github_token
  * AI_API_KEY=your_ai_api_key ``` 
## 🚀 Getting Started
  ### 1. Clone the Repository ``` git clone https://github.com/chiragarya67/AI-Codebase-Navigator.git cd AI-Codebase-Navigator ```
  ### 2. Backend Setup ``` cd server npm install npm run dev ```
  ### 3. Frontend Setup ``` cd ../client npm install npm run dev ``` 
  ## 🔄 API Endpoints
### Auth
* POST /api/auth/signup
* POST /api/auth/login
* GET /api/auth/me ### Repository
* POST /api/repo/analyze
* GET /api/repo/file-content
### AI
* POST /api/ai/explain
* POST /api/ai/question ---
## 🧪 How to Use
 1. Sign up or login
 2. Paste a GitHub repository URL
 3. Explore the file structure
 4. Click a file to see explanation
 5. Ask questions in chat ---
## 📌 Future Improvements
* 💳 Stripe payment integration
* 📊 Usage limits (Free / Pro / Premium plans)
* ⚡ Improved AI accuracy
* 🎨 UI/UX enhancements
* 🌍 Deployment (Render) 
### 🤝 Contributing Pull requests are welcome. For major changes, please open an issue first. ---
### 📄 License This project is licensed under the MIT License.
---
### 👨‍💻 Author **Chirag Arya**
gitHub: [https://github.com/chiragarya67](https://github.com/chiragarya67)
---
### ⭐ Support If you like this project, give it a star ⭐
