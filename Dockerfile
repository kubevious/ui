###############################################################################
# Step 1 : Builder image
FROM kubevious/node-builder:12 as build
WORKDIR /app
# ENV NODE_ENV production
ENV NODE_ENV development
ENV PATH /app/node_modules/.bin:$PATH
ENV SKIP_PREFLIGHT_CHECK true
COPY src/package.json ./
COPY src/package-lock.json ./
RUN npm ci
# RUN npm ci --only=production
COPY src/ ./
RUN npm run build

###############################################################################
# Step 2 : Runner image
FROM kubevious/nginx:1.8
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=build /app/build /usr/share/nginx/html
