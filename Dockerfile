FROM node:14.16-alpine as development
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:14.16-alpine as production
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY --from=development /src/dist ./dist

CMD ["node", "dist/index.js"]




