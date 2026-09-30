# Triagem de Ocorrências · Aeroscan

Mini central de ocorrências para um gestor de segurança que recebe alertas de drones de vários sites. O sistema registra os alertas, agrupa os repetidos, lista por prioridade e permite acompanhar cada ocorrência até a resolução.

**Stack:** TypeScript, Node.js, MongoDB e React (Vite).

## Sumário

- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar com Docker](#como-rodar-com-docker)
- [Como rodar sem Docker](#como-rodar-sem-docker)
- [Frontend compilado (estático)](#frontend-compilado-estático)
- [API](#api)
- [Como usei IA](#como-usei-ia)
- [Premissas](#premissas)
- [O que ficou de fora](#o-que-ficou-de-fora)

## Estrutura do repositório

```
.
├── backend/            API Node.js + TypeScript + MongoDB (com Dockerfile)
├── frontend/           código-fonte do React (com Dockerfile)
│   └── src/
│       ├── components/ FilterBar, OccurrenceCard, ResolveForm
│       ├── hooks/      useOccurrences (estado, filtro e ações)
│       ├── services/   api.ts (chamadas HTTP)
│       ├── types/      tipos, pesos e rótulos
│       └── styles/     global.css
├── frontend-dist/      frontend compilado, pronto para abrir sem build
├── docker-compose.yml  sobe mongo + backend + frontend
└── README.md
```

## Como rodar com Docker

**Pré-requisito:** Docker com o Compose instalado.

```bash
docker compose up --build
```

| Serviço  | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:8080   |
| API      | http://localhost:3000   |
| MongoDB  | interno (não exposto)   |

Comandos úteis:

```bash
docker compose ps                  # status dos serviços
docker compose logs -f backend     # logs do backend
docker compose down                # para tudo
docker compose down -v             # para tudo e apaga os dados do Mongo
```

### Só o backend

```bash
docker build -t aeroscan-backend ./backend
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/aeroscan \
  aeroscan-backend
```

> O frontend embute a URL da API no build. Se mudar a porta do backend, altere o `args.VITE_API_URL` do serviço `frontend` no `docker-compose.yml` e rode `docker compose up --build` de novo.

## Como rodar sem Docker

**Pré-requisitos:** Node.js 20+ e um MongoDB acessível (local ou Atlas).

### 1. Backend

```bash
cd backend
npm install
export MONGO_URI=mongodb://localhost:27017/aeroscan   # Windows (PowerShell): $env:MONGO_URI="..."
export PORT=3000
npm run dev          # desenvolvimento
# ou
npm run build && npm start
```

Variáveis de ambiente:

| Variável    | Descrição                  | Padrão sugerido                       |
| ----------- | -------------------------- | ------------------------------------- |
| `MONGO_URI` | String de conexão do Mongo | `mongodb://localhost:27017/aeroscan`  |
| `PORT`      | Porta da API               | `3000`                                |

Para subir apenas o Mongo via Docker:

```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

### 2. Frontend (desenvolvimento)

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

A URL da API vem de `VITE_API_URL` (padrão `http://localhost:3000`):

```bash
VITE_API_URL=http://localhost:4000 npm run dev
```

Checagem de tipos (opcional): `npm run typecheck`.

## Frontend compilado (estático)

O frontend compilado fica em **`frontend-dist/`**. Basta abrir o `frontend-dist/index.html` no navegador, sem rodar build e sem servidor. JS e CSS estão inlinados no HTML.

Requisito: o backend deve estar rodando em `http://localhost:3000` (URL usada no build).

Para gerar de novo:

```bash
cd frontend
npm install
npm run build        # grava em ../frontend-dist
```

## API

Todas as rotas usam JSON. O backend precisa ter CORS habilitado, pois o frontend roda em outra origem.

### `POST /occurrences`

Registra uma ocorrência.

```json
{
  "siteId": "site-01",
  "droneId": "drone-07",
  "type": "intrusion",
  "severity": 3,
  "detectedAt": "2026-09-30T14:00:00.000Z"
}
```

**Agrupamento:** se já existir uma ocorrência **aberta** com o mesmo `siteId` e `type` nos últimos 10 minutos, nenhuma nova é criada. A existente tem o `count` incrementado e a `severity` aumentada em +1 (máximo 5).

### `GET /occurrences?status=&siteId=`

Lista as ocorrências ordenadas por prioridade, com filtros opcionais.

```
prioridade = severity × peso do tipo
```

| Tipo               | Peso |
| ------------------ | ---- |
| `intrusion`        | 3    |
| `perimeter_breach` | 2    |
| `low_battery`      | 1    |
| `signal_loss`      | 1    |

Em caso de empate, vem primeiro a de `detectedAt` mais recente.

### `PATCH /occurrences/:id/status`

Altera o status. Só são válidas as transições abaixo, sem pular etapas:

| De             | Para           | Exigência              |
| -------------- | -------------- | ---------------------- |
| `open`         | `acknowledged` | nenhuma                |
| `acknowledged` | `resolved`     | campo `note` obrigatório |

```json
{ "status": "resolved", "note": "Equipe verificou o perímetro." }
```

Transição inválida retorna **409**.

## Como usei IA


- **Ferramentas utilizadas:** _(ex.: Claude para gerar o frontend React e os Dockerfiles)_
- **Exemplo de prompt:** _(cole um prompt real que você usou)_
- **Algo que a IA errou e que corrigi:** _(ex.: o `React is not defined` por causa do runtime JSX; o `tsc` falhando no build do Docker por falta do `tsconfig.json`; `detectedAt` ignorado na entidade)_

## Premissas

Decisões tomadas onde o enunciado não deu resposta:

- O `detectedAt` vem do cliente; se ausente, usa-se a data atual.
- A janela de 10 minutos é calculada a partir do `detectedAt` da nova ocorrência.
- Ocorrências já `acknowledged` ou `resolved` não entram no agrupamento; um novo alerta cria uma ocorrência nova.
- `GET /occurrences` retorna um array de ocorrências, cada uma com `_id`.
- O `PATCH` recebe `{ status, note? }`; a `note` só é exigida ao resolver.
- Sem login nem paginação (fora do escopo do enunciado).
- O Docker usa `mongo:7`, backend na porta 3000 e frontend na 8080.

## Como usei IA
  
- **Ferramentas utilizadas:** _(ex.: Claude para gerar o frontend React e os Dockerfiles)_
- **Exemplo de prompt:** _(cole um prompt real que você usou)_
- **Algo que a IA errou e que corrigi:** _(ex.: o `React is not defined` por causa do runtime JSX; o `tsc` falhando no build do Docker por falta do `tsconfig.json`; `detectedAt` ignorado na entidade)_
### Documentação (README e arquivos de infraestrutura)
 
- **Ferramenta:** Claude.
- **O que a IA gerou:** este README, o `docker-compose.yml`, os Dockerfiles do backend e do frontend e o `README-frontend.md`.
- **Como conduzi:** dei à IA o PDF do desafio e pedi os textos em etapas (primeiro o Dockerfile, depois o README). A estrutura das seções (Como usei IA, Premissas) veio do próprio enunciado.
- **Exemplo de prompt:** _"Gere um Readme (markdown) para descrição e como rodar o projeto com e sem docker"_
- **O que revisei:** os comandos, as portas (3000 e 8080), os nomes das variáveis (`MONGO_URI`, `PORT`, `VITE_API_URL`) e os scripts do `package.json`, porque a IA não tinha acesso ao código do meu backend e assumiu esses nomes. Também preenchi à mão as seções que dependem da minha experiência real.
### CSS e aparência do frontend
 
- **Ferramenta:** Claude.
- **O que a IA gerou:** o `src/styles/global.css` completo: variáveis de cor, cards, badges de severidade (escala de 1 a 5, do cinza ao vermelho), chips de filtro, botões e mensagens de erro. Não usei biblioteca de UI; é CSS puro, sem design elaborado, como pede o enunciado.
- **Exemplo de prompt:** _"Agora crie o front com react de acordo com a descrição do pdf"_ (o CSS veio junto com os componentes).
- **Algo que a IA errou e que corrigi:** na primeira versão, o estilo global de `button` definia texto branco, e os chips de filtro não tinham cor própria. Os chips não selecionados ficavam com texto branco sobre fundo branco e sumiam. Corrigi definindo `color: var(--ink)` em `.chip`.
- **O que revisei:** o contraste do texto nos badges e nos botões, o foco visível nos botões e campos (`:focus-visible`) e o layout em tela estreita (os cards quebram em linha com `flex-wrap`).
