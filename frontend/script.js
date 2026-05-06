const API_URL = "http://127.0.0.1:8000/submit";

const questions = [
  "I make decisions quickly",
  "I evaluate risks effectively",
  "I take responsibility for decisions",

  "I communicate clearly",
  "I listen actively",
  "I give constructive feedback",

  "I think long-term",
  "I plan strategically",
  "I adapt to change"
];

function renderQuestions() {
  const container = document.getElementById("questions");

  questions.forEach((q, i) => {
    let html = `<p>${q}</p>`;
    for (let j = 1; j <= 5; j++) {
      html += `
        <label>
          <input type="radio" name="q${i}" value="${j}" required> ${j}
        </label>
      `;
    }
    container.innerHTML += html;
  });
}

renderQuestions();

function getBand(score) {
  if (score <= 7) return "Low";
  if (score <= 11) return "Medium";
  return "High";
}

document.getElementById("assessmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  let answers = [];

  for (let i = 0; i < 9; i++) {
    const val = document.querySelector(`input[name="q${i}"]:checked`);
    if (!val) {
      alert("Please answer all questions");
      return;
    }
    answers.push(parseInt(val.value));
  }

  const scores = {
    decisionMaking: answers.slice(0,3).reduce((a,b)=>a+b,0),
    communication: answers.slice(3,6).reduce((a,b)=>a+b,0),
    strategy: answers.slice(6,9).reduce((a,b)=>a+b,0)
  };

  const bands = {
    decisionMaking: getBand(scores.decisionMaking),
    communication: getBand(scores.communication),
    strategy: getBand(scores.strategy)
  };

  const payload = {
    name,
    email,
    answers,
    scores,
    bands,
    overallScore: answers.reduce((a,b)=>a+b,0)
  };

  document.getElementById("result").innerHTML = "Submitting...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === "success") {
      document.getElementById("result").innerHTML =
        "<h3>✅ Report sent to your email!</h3>";
    } else {
      throw new Error(data.message);
    }

  } catch (err) {
    document.getElementById("result").innerHTML =
      "<h3>❌ Failed to send email. Try again.</h3>";
  }
});