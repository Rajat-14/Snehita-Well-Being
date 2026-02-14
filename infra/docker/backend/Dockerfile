FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create uploads directory for serving static files
RUN mkdir -p uploads/team/buddies

