# PayLens AI

PayLens AI is a payment-failure investigation dashboard composed of a React frontend, an Express/MongoDB API, and a FastAPI analysis service.

## Prerequisites

- Node.js 20 or later
- Python 3.10 or later
- A running MongoDB instance

## Run locally

1. Configure the backend:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

   Update `MONGO_URI` in `backend/.env` if your MongoDB is not local.

2. In three terminals, run:

   ```powershell
   cd ai-service
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

   ```powershell
   cd backend
   npm install
   npm run seed
   npm start
   ```

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open the URL Vite prints (normally `http://localhost:5173`). The backend listens on port 5000 and the AI service on port 8000.

## API flow

`POST /api/ai/investigate` accepts `{ "paymentId": "PAY1001" }`. The backend fetches the payment from MongoDB, sends its complete details to the AI service, and returns a risk score, level, root cause, evidence, confidence, and recommendation.
