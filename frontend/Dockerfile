# BUILD STAGE
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PRODUCTION STAGE
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx default configuration works for most Vite apps, 
# but for SPAs you might need to handle routing.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
