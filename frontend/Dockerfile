FROM node:20

ENV npm_config_platform=linux
ENV npm_config_arch=x64

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]