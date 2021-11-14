FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY index.js ./
CMD node index.js
