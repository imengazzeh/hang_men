FROM nginx:alpine

# Copier tout le projet (HTML, CSS, JS, audio...) dans Nginx
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
