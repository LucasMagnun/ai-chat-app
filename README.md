📡 Chat IA Web App

Este projeto é uma aplicação de chat integrada a uma Inteligência Artificial (IA). Possui autenticação de usuários via Firebase, backend em NestJS com Prisma e PostgreSQL, e frontend em Next.js com TailwindCSS e Shadcn UI.

O sistema utiliza SSE (Server-Sent Events) para atualizar o chat em tempo real, proporcionando uma experiência fluida de conversa.

🎯 Funcionalidades

Login de usuário via Firebase Authentication.
Envio e recebimento de mensagens com integração à IA (Google Gemini ou outra API).
Listagem dinâmica das mensagens em tempo real (via SSE).
Armazenamento das conversas no banco PostgreSQL via Prisma ORM.
Interface responsiva construída com React, Next.js, TailwindCSS e Shadcn UI.
Estrutura organizada e componentes reutilizáveis.

🛠 Stack Tecnológica
Frontend

Framework: Next.js
Estilização: TailwindCSS
UI Components: Shadcn/UI
Form Handling: react-hook-form
Markdown Rendering: react-markdown
Autenticação: Firebase Authentication
Linguagem: TypeScript

Backend

Framework: NestJS
ORM: Prisma
Banco de Dados: PostgreSQL
Realtime: Server-Sent Events (SSE)
Autenticação: Firebase Authentication

🚀 Como rodar o projeto
Pré-requisitos
Node.js (>=18)
Yarn ou npm
PostgreSQL
Conta Firebase configurada com Authentication habilitado
Chave da API da IA (ex.: Google Gemini)

Vá para a pasta do backend:
cd backend

Instale dependências:
npm install

Configure variáveis de ambiente em .env:
DATABASE_URL="postgresql://user:password@localhost:5432/exammpledb?schema=public"
FRONTEND_URL=
GEMINI_API_KEY=

npx prisma migrate dev
npx prisma generate

Rode a aplicação:
npm run start:dev

Coloque o arquivo firebase-credentials.json na raiz do backend

Frontend

Vá para a pasta do frontend:
cd frontend

Instale dependências:
npm install

Configure variáveis de ambiente em .env:
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_URL=

Rode a aplicação:
npm run dev
