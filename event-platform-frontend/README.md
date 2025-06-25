# Aplicație web pentru evenimente
## Descriere generală
Eventfy este o aplicație web full-stack care permite utlizatorilor să descopere, să creeze și să gestioneze evenimente. Aplicația funcționează pentru diferite roluri: utlizator simplu, organizator și administrator. Include funcționalități moderne precum autentificare cu JWT, gestionare bilete, chat  AI inteligent și afișare evenimente pe hartă.

## Repository 
Codul sursă complet al proiectului este disponibil la următoarea adresă:

https://github.com/florinamare/Event-Planer

## Structură livrabile 

Proiectul conține următoarele componente:
- 'event-platform-backend/' aplicația backend realizată cu Node.js, Express, MongoDB
- 'event-platform-frontend/' aplicația frontend realizată cu React+Vite
- 'chat_ai/' microserviciu AI pentru sugestii, construit cu FastAPI și spaCy

## Cerințe preliminare
Asigură-te ca ai instalat
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (recomanndat: MongoDB Atlas)
- Git
-npm și pip

## Pași de instalare și rulare

### 1. Clonează proiectul

```bash
git clone https://github.com/florinamare/Event-Planer

cd Event-Planer

2. Instalare și rulare backend 

cd event-platform-backend
npm install
npm install cors
npm install express mongoose body-parser
npm run dev

3. Instalare și rulare frontend
cd ../event-platfrom-frontend
npm install
npm install leaflet axios lucide-react
npm install -D @tailwindcss/postcss tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm run dev

4. Microserviciu AI
cd ../chat_ai
python -m venv venv_ai
.\venv_ai\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000