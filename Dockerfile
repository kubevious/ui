###############################################################################
# Step 1 : Builder image
FROM kubevious/node-builder:14 as build
RUN node --version
RUN npm --version
RUN yarn --version
WORKDIR /app
COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./public ./public
COPY ./tools ./tools
COPY ./src ./src
COPY ./tsconfig.json ./
RUN ./tools/sync-public.sh
RUN ls -la ./public/
RUN ls -la ./public/img/
RUN ls -la ./src/
RUN npm run build
RUN ./tools/kubevious-npm-validate-nested-dependencies.sh
RUN ls -la /app
RUN ls -la /app/
RUN ls -la /app/build/

###############################################################################
# Step 2 : Runner image
FROM caddy:2.4.6-alpine
COPY --from=build /app/build /caddy/www
COPY ./caddy/kubevious-entrypoint.sh /etc/caddy/kubevious-entrypoint.sh
ENTRYPOINT ["/etc/caddy/kubevious-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]