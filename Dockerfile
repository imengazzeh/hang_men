# 1. Utiliser l'image officielle Nginx
FROM nginx:alpine

# 2. Copier le contenu du site dans le dossier HTML de Nginx
COPY . /usr/share/nginx/html

# 3. Exposer le port 80
EXPOSE 80
