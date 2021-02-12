ARG PORT=3000
ARG PROD_VERSION
ARG PARENT_VERSION=1.2.1-node14.15.3

FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PORT
ARG PARENT_VERSION
LABEL uk.gov.defra.prod.parent-image=defradigital/prod-development:${PARENT_VERSION}

ENV PORT ${PORT}
EXPOSE ${PORT}

# Install Gulp globally
RUN npm install -g gulp
RUN npm link gulp

# Install app dependencies
COPY --chown=node:node gulpfile.js ./gulpfile.js
COPY --chown=node:node package*.json ./
COPY --chown=node:node application.scss ./
RUN npm install

# Bundle app source
COPY --chown=node:node .env .
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/build/stylesheets/application.css ./public/build/stylesheets/

CMD [ "npm", "start" ]
