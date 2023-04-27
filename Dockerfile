# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /client

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Set the environment variable to production
ENV NODE_ENV=production

# Expose port 3100
EXPOSE 3100

# Start the server
CMD ["node", "server.js"]

