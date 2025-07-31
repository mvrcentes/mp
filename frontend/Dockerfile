# Development Dockerfile for Next.js using npm
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install the missing LightningCSS native module and rebuild
RUN npm install --include=optional lightningcss-linux-x64-gnu \
    && npm rebuild lightningcss --build-from-source \
    && npm install --include=optional @tailwindcss/oxide-linux-x64-gnu

# Copy source
COPY . .

# Ensure Next.js listens on all interfaces
ENV HOST 0.0.0.0
ENV PORT 3001

# Expose port and start in dev mode
EXPOSE 3001
CMD ["npm", "run", "dev"]