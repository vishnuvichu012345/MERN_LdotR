# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the application code
COPY . .

# Create the uploads directory
RUN mkdir -p uploads

# Expose port 5000 (or any other port your server is using)
EXPOSE 3000

# Start the Node.js server
CMD ["npm", "start"]
