FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/40-env.sh /docker-entrypoint.d/40-env.sh
COPY --from=build /app/dist /usr/share/nginx/html
COPY public/env-config.template.js /usr/share/nginx/html/env-config.template.js

RUN chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 8080

ENV API_BASE_URL=http://localhost:3000/api
ENV APP_TITLE="React Docker Deployment"
ENV APP_ENV=production

CMD ["nginx", "-g", "daemon off;"]
