from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from pydantic import BaseModel
from utils.gemini_helper import evaluate_device_power

app = FastAPI(title="Ethereum AI Validator")

# ... (Previous static/template mounts) ...
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Pydantic Model for incoming device data
class DeviceData(BaseModel):
    userAgent: str
    cores: str | int = "Unknown"
    memory: str | int = "Unknown"

@app.post("/api/detect-device")
async def detect_device(data: DeviceData):
    # Call Gemini to get the simulated assessment
    result = evaluate_device_power(data.dict())
    return result

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/about", response_class=HTMLResponse)
async def read_about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

@app.get("/contact", response_class=HTMLResponse)
async def read_contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
