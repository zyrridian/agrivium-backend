# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start the compiled app
# CMD ["node", "dist/src/server.js"]

# Run migrations before starting the server
CMD npx drizzle-kit push && node dist/src/server.js
