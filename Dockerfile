###############################################################################
# Step 1 : Builder image
FROM kubevious/node-builder:14 as build
RUN node --version
RUN npm --version
# ENV NODE_ENV production
# ENV NODE_ENV development
# ENV PATH /app/node_modules/.bin:$PATH
ENV SKIP_PREFLIGHT_CHECK true
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY ./public ./public
COPY ./tools ./tools
COPY ./src ./src
COPY ./tsconfig.json ./
RUN ./tools/sync-public.sh
RUN npm run build

###############################################################################
# Step 2 : Runner image
FROM kubevious/nginx:1.8
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html
