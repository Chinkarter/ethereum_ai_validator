import secrets
from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from pydantic import BaseModel
from utils.gemini_helper import evaluate_device_power, generate_validation_log

app = FastAPI(title="Ethereum AI Validator")

security = HTTPBasic()

def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "ETHAIVALIDATORS")
    correct_password = secrets.compare_digest(credentials.password, "ty%6783ghd7$@de")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class DeviceData(BaseModel):
    userAgent: str
    cores: str | int = "Unknown"
    memory: str | int = "Unknown"

@app.post("/api/detect-device", dependencies=[Depends(authenticate)])
async def detect_device(data: DeviceData):
    return evaluate_device_power(data.dict())

@app.get("/api/generate-validation-log", dependencies=[Depends(authenticate)])
async def get_log():
    log_text = generate_validation_log()
    return {"log": log_text}

@app.get("/", response_class=HTMLResponse, dependencies=[Depends(authenticate)])
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/about", response_class=HTMLResponse, dependencies=[Depends(authenticate)])
async def read_about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

@app.get("/contact", response_class=HTMLResponse, dependencies=[Depends(authenticate)])
async def read_contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse, dependencies=[Depends(authenticate)])
async def read_dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
