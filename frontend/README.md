immoGen – Project Setup & Opstartgids
immoGen is een webapplicatie waarmee gebruikers vastgoed kunnen beheren en doorzoeken.
Het project bestaat uit:

Backend: Python, FastAPI, Uvicorn

Frontend: React, Vite

📦 Vereisten
Docker & Docker Compose geïnstalleerd

Node.js geïnstalleerd (voor de frontend)

Python 3.x geïnstalleerd (indien lokaal zonder Docker)

⚙️ Project Setup
📂 Projectstructuur
text
Kopiëren
Bewerken
immoGen/
├── backend/           # FastAPI backend
├── frontend/          # React + Vite frontend
├── docker-compose.yml # Docker configuratie
├── .gitignore         # Bestanden die genegeerd worden
└── README.md          # Documentatie


🚀 Project opstarten
1. Backend starten met Docker
Ga naar de root van je project:

bash
Kopiëren
Bewerken
docker-compose up --build
👉 Dit bouwt en start de FastAPI backend.

Stoppen:
Gebruik Ctrl + C in de terminal.

2. Frontend starten
Ga naar de frontend map:

bash
Kopiëren
Bewerken
cd frontend
npm install    # Eenmalig nodig om node_modules opnieuw te installeren
npm run dev    # Start Vite dev server op http://localhost:5173
Stoppen:
Gebruik Ctrl + C in de terminal.

3. (Optioneel) Backend lokaal zonder Docker
bash
Kopiëren
Bewerken
cd backend
python -m venv venv               # Virtuele omgeving aanmaken
source venv/bin/activate          # Virtuele omgeving activeren
pip install -r requirements.txt   # Vereisten installeren
uvicorn app.main:app --reload     # Start FastAPI server

🗑️ Git Ignore Bestanden
Deze mappen en bestanden worden niet mee gepusht naar Git:

node_modules/

venv/

.env bestanden (lokaal te beheren)

🌐 Belangrijke URLs
Service	URL
Frontend	http://localhost:5173
Backend API	http://localhost:8000

✅ Samenvatting
Stap	Command
Backend starten (Docker)	docker-compose up --build
Frontend starten	npm run dev
Backend lokaal (zonder Docker)	uvicorn app.main:app --reload
Stoppen	Ctrl + C