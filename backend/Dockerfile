# Build command : docker build -t jjveldscholten/slimmemeter-backend .
# Run Command   : docker run -it -p 3010:3010 --name backend jjveldscholten/slimmemeter-backend
# Push Command  : docker push jjveldscholten/slimmemeter-backend

FROM arm32v7/node

WORKDIR /

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]