FROM node:alpine
LABEL authors="Rahman YILMAZ"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "-r", "dotenv/config", "build"]
