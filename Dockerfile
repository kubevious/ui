###############################################################################
# Step 1 : Builder image
FROM kubevious/node-builder:14 as build
RUN node --version
RUN npm --version
RUN yarn --version
# ENV NODE_ENV production
# ENV NODE_ENV development
# ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./public ./public
COPY ./tools ./tools
COPY ./src ./src
COPY ./tsconfig.json ./
RUN ./tools/sync-public.sh
RUN npm run build
RUN ./tools/kubevious-npm-validate-nested-dependencies.sh
RUN ls -la /app
RUN ls -la /app/
RUN ls -la /app/build/

###############################################################################
# Step 2 : Runner image
FROM kubevious/nginx:1.8
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html
