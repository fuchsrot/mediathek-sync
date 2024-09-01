# Use an existing image as a base
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY dist ./
COPY package.json ./


# Expose the port that the app listens on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "stat:prod"]