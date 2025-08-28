# Step 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all deps (including devDependencies for build)
RUN npm install

# Copy rest of the code
COPY . .

# Build NestJS project (needs nest CLI from devDeps)
RUN npm run build

# Step 2: Runtime stage (lightweight)
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only package.json for install
COPY package*.json ./

# Install only production deps
RUN npm install --only=production

# Copy dist output from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose port
EXPOSE 3001

# Start app
CMD ["node", "dist/main.js"]
