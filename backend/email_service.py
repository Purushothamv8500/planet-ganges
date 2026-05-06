import os
import requests

def generate_feedback(band, dimension):
    if band == "Low":
        return f"Your {dimension} skills need improvement."
    elif band == "Medium":
        return f"Your {dimension} skills are good but can improve."
    else:
        return f"You have strong {dimension} skills."

def send_email(data):
    api_key = os.getenv("RESEND_API_KEY")

    url = "https://api.resend.com/emails"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    html = f"""
    <h2>Leadership Assessment Report</h2>
    <p><strong>Name:</strong> {data['name']}</p>

    <h3>Results</h3>
    <ul>
        <li>
            Decision Making: {data['scores']['decisionMaking']} ({data['bands']['decisionMaking']})
            <br>{generate_feedback(data['bands']['decisionMaking'], "Decision Making")}
        </li>
        <br>
        <li>
            Communication: {data['scores']['communication']} ({data['bands']['communication']})
            <br>{generate_feedback(data['bands']['communication'], "Communication")}
        </li>
        <br>
        <li>
            Strategic Thinking: {data['scores']['strategy']} ({data['bands']['strategy']})
            <br>{generate_feedback(data['bands']['strategy'], "Strategic Thinking")}
        </li>
    </ul>

    <h3>Overall Score: {data['overallScore']}</h3>
    """

    payload = {
        "from": "onboarding@resend.dev",
        "to": [data["email"]],
        "subject": "Your Leadership Assessment Report",
        "html": html
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise Exception(response.text)