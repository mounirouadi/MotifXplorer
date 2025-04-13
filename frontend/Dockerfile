# Use a Node base image
FROM node:18-buster-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Ensure the app binds to 0.0.0.0 for external access
ENV HOST=0.0.0.0
ENV WDS_SOCKET_PORT=0

# Expose the React development server port
EXPOSE 3000

# Run the React development server
CMD ["npm", "start"]
