FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and other dependencies required for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]

