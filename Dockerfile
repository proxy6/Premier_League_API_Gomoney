FROM node:alpine
WORKDIR /gict
ADD package*.json ./
# COPY package.json /gict/package.json
RUN npm install
ADD . .
# COPY . /gict/
ENV PORT 80
CMD node app.js
# CMD ["node", "/gict/app.js"]

