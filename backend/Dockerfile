# Build command : docker build -t jjveldscholten/slimmemeter-backend .
# Run Command   : docker run -it -p 80:80 --name backend jjveldscholten/slimmemeter-backend
# Push Command  : docker push jjveldscholten/slimmemeter-backend

FROM arm32v7/node

WORKDIR /


RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates 

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["npm", "start"]