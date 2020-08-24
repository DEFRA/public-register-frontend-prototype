ARG PORT=3000

FROM node:14
ARG PORT

# Install app dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Bundle app source
COPY --chown=node:node .env .
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/build/stylesheets/application.css ./public/build/stylesheets/

ENV PORT ${PORT}
EXPOSE ${PORT}

# Run the app
# CMD ["node", "./src/server.js"]
CMD [ "npm", "start" ]
