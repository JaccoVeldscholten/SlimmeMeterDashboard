FROM arm32v7/node

# Set working directory
WORKDIR /

# Copy Package
COPY package.json ./

# Install Deps
RUN npm install --force       
RUN npm i react
RUN npm i react-scripts

# Copy the app to Workdir
COPY . ./

# Expose Port to Outside world
EXPOSE 3000

# start app
CMD ["npm", "start"]