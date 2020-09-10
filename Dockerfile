ARG PORT=3000
ARG PROD_VERSION
ARG PARENT_VERSION=1.0.1-node12.16.0

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PORT
ARG PARENT_VERSION
LABEL uk.gov.defra.prod.parent-image=defradigital/prod-development:${PARENT_VERSION}

ENV PORT ${PORT}
EXPOSE ${PORT}

# Install app dependencies
COPY --chown=node:node package*.json ./
COPY --chown=node:node application.scss ./
RUN npm install
# RUN npm run install-css

# Bundle app source
COPY --chown=node:node .env .
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/build/stylesheets/application.css ./public/build/stylesheets/

# RUN export PACKAGE_VERSION=$(node -p "require('./package.json').version")

# Run the app
# CMD ["node", "./src/server.js"]
CMD [ "npm", "start" ]

# Production
# FROM defradigital/node:${PARENT_VERSION} AS production
# ARG PARENT_VERSION
# LABEL uk.gov.defra.prod.parent-image=defradigital/prod:${PARENT_VERSION}

# ARG PORT
# ENV PORT ${PORT}
# EXPOSE ${PORT}

# # Install app dependencies
# COPY --chown=node:node package*.json ./
# RUN npm install
# RUN npm run install-css

# # Bundle app source
# COPY --chown=node:node .env .
# COPY --chown=node:node src/ ./src/
# COPY --chown=node:node public/build/stylesheets/application.css ./public/build/stylesheets/

# CMD [ "npm", "start" ]