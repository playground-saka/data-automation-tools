# Use Node.js base image version 20.15.1
FROM node:20.15.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code to the working directory
COPY . .

# Build the application (add this step if you have a build command)
RUN npm run build

# Check syntax and code style using ESLint
RUN npm run lint

# Run tests
RUN npm test

# Expose the port used by the application
EXPOSE 9135

# Run the application
CMD ["npm", "start"]

