# Use a Node base image
FROM node:18-buster-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React application for production
RUN npm run build

# Install 'serve' to serve the static build
RUN npm install -g serve

# Expose port 3001
EXPOSE 3001

# Serve the production build on port 3001, binding to all interfaces
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3001"]
