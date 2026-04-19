# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install instead of ci to avoid lockfile issues)
RUN npm install --only=production

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
