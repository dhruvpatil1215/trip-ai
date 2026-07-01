# 🌍 Trrip AI

**Trrip AI** is an AI-powered travel planning platform that automatically generates personalized travel itineraries from uploaded travel documents such as flight tickets, hotel bookings, and travel confirmations.

Using AI, Trrip AI extracts travel information, analyzes trip details, and creates organized day-by-day travel plans to help users enjoy a hassle-free travel experience.

---

## ✨ Features

### 🤖 AI-Powered Itinerary Generation

* Generate complete travel plans automatically.
* Create day-wise schedules based on travel dates.
* Personalized recommendations for attractions and activities.

### 📄 Smart Document Processing

* Upload flight tickets, hotel bookings, and travel documents.
* Extract travel information using OCR and AI.
* Supports PDF and image files.

### 🗺️ Travel Planning

* Destination-based itinerary suggestions.
* Activity recommendations.
* Travel timeline management.

### 🔐 User Authentication

* Secure user registration and login.
* JWT-based authentication.
* Protected user dashboard.

### 📚 Trip History

* Save generated itineraries.
* Access previous trips anytime.
* Manage multiple travel plans.

### 📤 Sharing & Export

* Share itineraries with friends and family.
* Download travel plans as PDF.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### AI & Processing

* Google Gemini API
* Tesseract.js (OCR)
* PDF-Parse

### Authentication

* JWT (JSON Web Token)
* Bcrypt.js

---

## 📂 Project Structure

```bash
trrip-ai/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── package.json
│
├── README.md
└── .env
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/trrip-ai.git
cd trrip-ai
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
cd ../client
npm run dev
```

---

## 🔄 Workflow

1. User registers or logs in.
2. Uploads travel documents (PDF/Image).
3. AI extracts travel information.
4. System identifies destinations and travel dates.
5. Gemini AI generates a personalized itinerary.
6. Itinerary is stored in MongoDB.
7. User can view, edit, share, or download the trip plan.

---

## 🎯 Future Enhancements

* Real-time weather integration.
* Google Maps integration.
* Expense tracking.
* Multi-language support.
* AI travel chatbot.
* Group trip planning.
* Flight and hotel booking integration.
* Smart budget recommendations.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Dhruv Patil**

Diploma in Computer Engineering | Full Stack Developer | AI Enthusiast

Building intelligent solutions that simplify real-world travel planning through Artificial Intelligence.
