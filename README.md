🧠 Chat com Integração de IA

Este projeto consiste em uma aplicação Web de Chat com integração a um modelo de Inteligência Artificial (IA).
A solução é dividida em dois repositórios: Frontend e Backend, utilizando tecnologias modernas para autenticação, armazenamento e comunicação com APIs de IA.

📌 Objetivo

Permitir que o usuário:

Faça login com Firebase Authentication.

Troque mensagens com uma IA (ex.: Google Gemini API).

Tenha suas conversas armazenadas em um banco relacional via Prisma ORM.

⚙️ Tecnologias Utilizadas
🔹 Frontend

React
 + Next.js

TailwindCSS

Integração com backend via API

🔹 Backend

Firebase Authentication

Firebase Cloud Functions

Prisma ORM
 com PostgreSQL

Integração com Gemini API (Google AI)

📂 Estrutura do Projeto

Frontend → Interface do usuário (React + Tailwind).

Backend → Autenticação, integração com IA, persistência de dados (Firebase + Prisma + PostgreSQL).

🔑 Variáveis de Ambiente
Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/chatdb?schema=public"
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key

Frontend (.env.local)

NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain

NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id

NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

NEXT_PUBLIC_API_URL=http://localhost:5000

🚀 Configurar Backend
cd backend
cp .env.example .env   # configure suas variáveis
npm install
npx prisma migrate dev
npm run dev

Configurar Frontend
cd frontend
cp .env.example .env.local   # configure suas variáveis
npm install
npm run dev

✅ Funcionalidades

🔐 Login de usuário via Firebase Authentication

💬 Chat funcional com IA (Gemini API)

🗄️ Armazenamento das conversas em banco PostgreSQL

🎨 Interface responsiva e estilizada com TailwindCSS
