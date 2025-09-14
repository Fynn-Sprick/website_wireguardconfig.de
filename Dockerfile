FROM node:20.15.0-bullseye
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
RUN npm install --legacy-peer-deps
COPY ./node_modules ./node_modules
COPY . .
RUN npm run build

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./public ./public
#COPY ./.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]

