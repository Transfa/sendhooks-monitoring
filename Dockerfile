# Use the official Node.js 20 image based on Alpine Linux as the base image.
# Alpine is chosen for its small size and reduced number of packages.
FROM node:20-alpine

# Set the working directory inside the container to /app.
# All subsequent commands will be run from this directory.
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory.
# This is done separately to leverage Docker's cache and avoid reinstalling
# dependencies if the package files have not changed.
COPY package*.json ./

# Install dependencies defined in package.json.
# npm install is run to install the dependencies.
RUN npm install

# Copy the rest of the application's source code to the working directory.
COPY . .

# Compile the application if necessary.
# This step is project-specific; for example, it could be TypeScript compilation.
RUN npm run build

# Specify the command to run the application.
# Here, npm start is used to run the application as defined in package.json's scripts.
CMD ["npm", "start"]
