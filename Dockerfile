###############################################################################
# Step 1 : Builder image
FROM kubevious/node-builder:12 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install react-scripts@3.4.1 -g
COPY src-react/package.json ./
COPY src-react/package-lock.json ./
RUN npm ci
COPY src-react/ ./
RUN npm run build
# RUN node --expose-gc --max-old-space-size=700 node_modules/react-scripts/scripts/build.js

###############################################################################
# Step 2 : Runner image
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/* /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]