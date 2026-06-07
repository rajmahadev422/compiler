FROM node:22-slim

# Install g++ compiler tools inside Render's Linux environment
RUN apt-get update && apt-get install -y \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy all project files and directories
COPY . .

# Remove any lingering local Windows-compiled binaries
RUN rm -f temp/main.exe temp/temp_program.exe

# Inform Render that the container listens on port 3000
EXPOSE 3000

# Start with standard node for production
CMD ["node", "server.js"]
