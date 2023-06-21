FROM node:16

WORKDIR /app

# Install app dependencies
COPY . .

RUN npm install

# build the app
RUN npm run build

EXPOSE 3002

# run the migrations

CMD [ "npm", "run", "start:prod" ]