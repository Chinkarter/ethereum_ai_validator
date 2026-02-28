import google.generativeai as genai
import os
import json

# Initialize Gemini with the API Key provided by the system/environment
# Note to User: Set GEMINI_API_KEY environment variable. 
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

def evaluate_device_power(device_data: dict) -> dict:
    """
    Takes user_agent and CPU cores info and asks Gemini to estimate computing power 
    and assign a simulated hourly earning rate in USD for the educational simulation.
    """
    
    prompt = f"""
    You are an AI analyzing device hardware for a simulated Ethereum distributed computing network.
    Here is the data provided by the user's browser:
    User-Agent: {device_data.get('userAgent', 'Unknown')}
    Reported Cores: {device_data.get('cores', 'Unknown')}
    
    Based on this data, estimate the device type (e.g., Mobile Phone, Basic Laptop, Gaming Desktop).
    Then, assign a simulated hourly earning rate between 1.00 and 50.00 USD. 
    Low power (phones) = ~$2.
    Medium (laptops) = ~$10.
    High (Desktops/MacBooks) = ~$20.
    Ultra (Gaming PC/Workstations) = ~$40+.
    
    Return EXACTLY a JSON object with two keys:
    1. 'device_assessment': A short 1-sentence description of what you think the device is.
    2. 'hourly_rate': A number representing the USD hourly rate (e.g., 2.50, 15.00, 42.00).
    
    DO NOT return any markdown wrapping or backticks. Only return the raw JSON string.
    """
    
    try:
        response = model.generate_content(prompt)
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text_response)
        
        # Fallback ensuring correct types
        return {
            "device_assessment": result.get("device_assessment", "Unknown Device detected based on UA."),
            "hourly_rate": float(result.get("hourly_rate", 5.00))
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback to a medium tier if API fails or key isn't set
        return {
            "device_assessment": "Standard capability device detected (Fallback mode).",
            "hourly_rate": 8.50
        }
