import os
from pathlib import Path
from dotenv import load_dotenv

# Load from ai-service/.env
current_dir = Path(__file__).resolve().parent
ai_env = current_dir.parent / ".env"
if ai_env.exists():
    load_dotenv(dotenv_path=ai_env, override=False)

# Also check backend/.env
backend_env = current_dir.parent.parent / "backend" / ".env"
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=False)

# Root workspace .env
root_env = current_dir.parent.parent / ".env"
if root_env.exists():
    load_dotenv(dotenv_path=root_env, override=False)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
