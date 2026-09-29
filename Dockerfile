# ---- build: compila o React ----
FROM node:24-alpine AS build
WORKDIR /build/frontend
COPY package*.json ./
RUN npm ci
COPY . .
# URL da API que o NAVEGADOR vai chamar (é embutida no build)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
# o vite.config.ts grava a saída em ../frontend-dist
RUN npm run build

# ---- runtime: nginx servindo os arquivos estáticos ----
FROM nginx:alpine
COPY --from=build /build/frontend-dist /usr/share/nginx/html
EXPOSE 80
