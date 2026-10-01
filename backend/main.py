import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

# Load environment variables from .env file.
# Keeping the API key outside the source code prevents
# accidentally exposing it on GitHub.
load_dotenv()

# Initialize FastAPI application
app = FastAPI()

# Enable CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gemini API client
# It automatically picks up the GEMINI_API_KEY environment variable.
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Failed to initialize Gemini client: {e}")

# Retrieve the configured model from environment variables, fallback to the recommended gemini-3.8-flash
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Gemini API Lab is running"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    # Validate that the message is not empty
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # Ensure the API key is configured
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server")
        
    if client is None:
         raise HTTPException(status_code=500, detail="Gemini client could not be initialized")

    try:
        # Send the user's message to the Gemini API
        # Using the current interactions API recommended for Gemini
        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            input=request.message
        )
        
        # Return the generated response text
        return {"response": interaction.output_text}
        
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
