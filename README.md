# 🤖 AI-CRM — Healthcare Professional Interaction Platform

An AI-powered CRM application designed to help field representatives record and manage Healthcare Professional (HCP) interactions using natural language.

The system uses **LangGraph and LLMs** to convert conversational input into structured CRM data, helping reduce manual data entry and making interaction tracking more efficient.

---

## ✨ Features

* 🧠 **AI-powered interaction extraction**

  * Convert natural-language descriptions into structured CRM information.
* 👨‍⚕️ **HCP interaction management**

  * Record and manage Healthcare Professional interactions.
* 😊 **Sentiment analysis**

  * Identify the sentiment of interactions using AI.
* 📋 **Structured CRM data**

  * Automatically extract important details such as doctor, product, discussion, and follow-up information.
* 🔄 **AI workflow orchestration**

  * LangGraph-based workflow for processing user input.
* ⚡ **REST API backend**

  * FastAPI backend for handling CRM and AI operations.
* 💻 **Modern frontend**

  * React-based interface for entering and reviewing interactions.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │  Interaction Form   │
                    │  CRM Dashboard      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │                     │
                    │  API Routes         │
                    │  Business Logic     │
                    │  Data Validation    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   LangGraph Agent   │
                    │                     │
                    │  LLM Processing     │
                    │  Data Extraction    │
                    │  Sentiment Analysis │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    │                     │
                    │   CRM Interaction   │
                    │        Data         │
                    └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Python
* FastAPI
* REST APIs

### AI / LLM

* LangGraph
* LLM API
* Natural Language Processing
* Sentiment Analysis

### Database

* SQL / Relational Database

### Development Tools

* Git
* GitHub
* VS Code

---

## 📁 Project Structure

```text
AI-CRM/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── agent/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sandhiya-N/AI-CRM.git
```

```bash
cd AI-CRM
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
LLM_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file for sensitive configuration.

Example:

```env
LLM_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

**Do not commit `.env` to GitHub.**

Use `.env.example` instead:

```env
LLM_API_KEY=
DATABASE_URL=
```

---

## 🔄 How It Works

1. The field representative enters an HCP interaction in natural language.
2. The request is sent to the FastAPI backend.
3. LangGraph orchestrates the AI processing workflow.
4. The LLM extracts structured information from the conversation.
5. Relevant information such as HCP details, products, discussion points, sentiment, and follow-up actions is identified.
6. The structured information is returned to the frontend.
7. The CRM record can then be reviewed and stored.

---

## 🎯 Example

### Input

```text
Met Dr. Kumar today and discussed Product X.
He was interested in the product and requested more information.
I will follow up next week.
```

### AI-Extracted Data

```text
HCP: Dr. Kumar

Product: Product X

Sentiment: Positive

Discussion:
Product effectiveness and information request

Follow-up:
Next week
```

---

## 📌 Key Learning

This project helped me work with:

* AI/LLM integration
* LangGraph workflows
* FastAPI REST APIs
* React frontend development
* Natural-language processing
* Structured data extraction
* CRM workflow design
* Frontend-backend integration
* Environment variable management

---

## 👩‍💻 Author

**Sandhiya N**

Python Developer | Backend & AI

GitHub:
https://github.com/Sandhiya-N

---

## 📄 License

This project was developed for educational and portfolio purposes.
