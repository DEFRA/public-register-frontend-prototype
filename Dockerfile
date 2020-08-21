FROM node:14

# Install app dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Bundle app source
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/build/stylesheets/application.css ./public/build/stylesheets/

EXPOSE ${PORT}

# Run the app
# CMD ["node", "./src/server.js"]
CMD [ "npm", "start" ]
