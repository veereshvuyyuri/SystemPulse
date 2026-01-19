# Frontend Dockerfile
# Step 1: Build the React App
FROM node:18-slim AS build

WORKDIR /app

# The context is now the root project
COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
