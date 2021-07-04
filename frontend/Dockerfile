FROM node:14

# Set working directory
WORKDIR /app

# Copy Package
COPY package.json ./

# Install Deps
RUN npm install 

# Copy the app to Workdir
COPY . ./

# Expose Port to Outside world
EXPOSE 3000

# start app
CMD ["npm", "start"]