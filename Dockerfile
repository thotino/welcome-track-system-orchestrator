# Étape 1 : Build (installation des dépendances)
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Étape 2 : Image finale, plus légère
FROM node:22-alpine

WORKDIR /app

# Copie uniquement node_modules et le code depuis l’étape de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

# Ajoute un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 1200

CMD ["node", "index.js"]
