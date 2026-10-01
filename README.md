# Gemini API Lab

## Description
This project demonstrates how a Python FastAPI backend communicates with Google's Gemini API and provides a simple browser-based chat interface. It is a complete beginner-friendly project meant for learning API integration.

## Features
* Gemini API integration using the `google-genai` Python SDK
* FastAPI backend
* Uses the current recommended `gemini-3.8-flash` model
* Simple chat interface built with HTML, CSS, and Vanilla JavaScript
* Environment-variable API key management for security
* Error handling (missing API key, empty message, network issues)
* GitHub-ready structure (secrets protected, properly ignored files)

## Architecture
```text
Browser
   ↓
Frontend JavaScript
   ↓
FastAPI
   ↓
Gemini API
   ↓
FastAPI
   ↓
Browser
```

## Installation

Run these commands in Windows PowerShell to set up the backend:

```powershell
cd gemini-api-lab
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate

# Install the required packages
pip install -r requirements.txt
```

## Environment setup

In the `backend/` directory, create a `.env` file based on `.env.example`.

Example:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

**Note:** You must obtain your own Gemini API key from [Google AI Studio](https://aistudio.google.com/). 
Never commit your `.env` file to version control. The `.gitignore` file in this project is already configured to prevent this.

## Running

1. Start the backend server:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

2. Open the frontend:
Simply open `frontend/index.html` in your web browser.

## API Endpoints

### `GET /`
Check if the API is running.
**Response:**
```json
{
  "message": "Gemini API Lab is running"
}
```

### `POST /api/chat`
Send a message to the Gemini API.
**Request:**
```json
{
  "message": "Hello"
}
```
**Response:**
```json
{
  "response": "Hello! How can I help you today?"
}
```

## Troubleshooting

* **API key missing**: Ensure you have created the `.env` file and added your `GEMINI_API_KEY`.
* **Invalid API key**: Double-check that your API key is copied correctly from Google AI Studio.
* **Model unavailable**: The backend defaults to `gemini-3.8-flash`. Ensure this model is available in your region.
* **Package installation issue**: Ensure your virtual environment is activated before running `pip install`.
* **Port already in use**: If port 8000 is taken, you can run Uvicorn on a different port: `uvicorn main:app --reload --port 8001`. (Remember to update the API URL in `script.js`).
* **Gemini API error**: Check the terminal running Uvicorn for detailed error messages.
