# Desafio - CRUD de Veículos (NestJS + Angular + RabbitMQ + Docker)

Aplicação full-stack para gerenciamento de veículos com backend em NestJS, frontend em Angular, mensageria com RabbitMQ e execução simplificada via Docker Compose.

## 📦 Stack

- Backend: NestJS (Node.js) + Swagger + Validação (class-validator)
- Frontend: Angular 20 (standalone, signals, HttpClient)
- Mensageria: RabbitMQ (api + consumer separado)
- Deploy local: Docker + Docker Compose

## 🗂 Estrutura

```text
backend/   # API, consumer e lógica de domínio
frontend/  # Aplicação Angular
docker-compose.yml  # Orquestra todo o ambiente
```

## 🚀 Subir tudo com Docker (recomendado)

Pré‑requisitos: Docker e Docker Compose.

```bash
docker compose build
docker compose up -d
```

| Serviço     | Porta | Descrição                |
| ----------- | ----- | ------------------------ |
| Frontend    | 8080  | SPA Angular              |
| Backend API | 3000  | Endpoints REST + Swagger |
| RabbitMQ    | 5672  | Broker                   |
| RabbitMQ UI | 15672 | Management (guest/guest) |

Acesse:

- Frontend: <http://localhost:8080>
- API Swagger: <http://localhost:3000/docs>
- RabbitMQ UI: <http://localhost:15672>

O frontend consome a API via reverse proxy (`/api/*`) configurado no Nginx do container.

## 🧪 Testes Backend

Dentro de `backend/`:

```bash
npm install
npm test          # unit
npm run test:e2e  # e2e
```

## 🛠 Desenvolvimento sem Docker

Em dois terminais:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (proxy para /api)
cd ../frontend
npm install
npm start
```

Acesse <http://localhost:4200>.

## 🔌 Endpoints Principais

| Método | Rota          | Descrição        |
| ------ | ------------- | ---------------- |
| POST   | /vehicles     | Cria veículo     |
| GET    | /vehicles     | Lista veículos   |
| GET    | /vehicles/:id | Obtém veículo    |
| PUT    | /vehicles/:id | Atualiza veículo |
| DELETE | /vehicles/:id | Remove veículo   |

Body (POST/PUT):

```json
{
  "placa": "ABC1D23",
  "chassi": "12345678901234567",
  "renavam": "123456789",
  "modelo": "Modelo X",
  "marca": "Marca Y",
  "ano": 2024
}
```

## 🖥 Frontend

Tela única de listagem + criação + remoção:

- Recarregar lista
- Inserir novo veículo
- Remover veículo
- Feedback de carregamento/erros

Chamadas feitas para `/api/vehicles` (proxy no Nginx ou dev proxy Angular).

## 🧵 Mensageria / Microserviço

O container `consumer` executa `npm run start:consumer`, consumindo mensagens via RabbitMQ (endpoint configurado em `RABBITMQ_URL`). Ajuste a lógica em `backend/src/messaging/` conforme evolução de casos de uso.

## 🗃 Persistência

Dados de veículos armazenados em arquivo JSON (`backend/data/vehicles.json`). Volume montado para persistir entre recriações de containers.

## 🔐 Variáveis de Ambiente Importantes

| Variável     | Serviço  | Default              |
| ------------ | -------- | -------------------- |
| PORT         | backend  | 3000                 |
| RABBITMQ_URL | api/cons | amqp://rabbitmq:5672 |

## 🧩 Estrutura do Frontend (principais arquivos)

```text
src/app/vehicles/
  vehicle.model.ts
  vehicles.service.ts
  vehicles-list.component.ts
```

## 🐳 Ajustes e Extensões Futuras

- Editar/atualizar veículos no frontend
- Paginação e busca
- Autenticação (JWT) se necessário
- Testes unitários frontend (Jasmine/Karma)
- Persistência em banco relacional (PostgreSQL) ou NoSQL

## ♻ Reset do Ambiente

```bash
docker compose down -v   # remove containers + volumes
docker compose up -d --build
```

## ✅ Checklist Requisitos

- [x] Backend NestJS com CRUD
- [x] Testes backend (unit + e2e)
- [x] Endpoints REST
- [x] Frontend Angular 16+ (listagem CRUD parcial)
- [x] Docker (API, consumer, RabbitMQ, frontend)
- [x] Microserviço consumer com RabbitMQ
- [x] README abrangente

---

Qualquer dúvida ou melhoria desejada, abra uma issue ou proposta de PR.
