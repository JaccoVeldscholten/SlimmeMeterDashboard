FROM arm32v7/node

WORKDIR /


RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates 

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3010

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["npm", "start"]