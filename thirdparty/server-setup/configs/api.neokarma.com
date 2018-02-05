server {
        listen 80;
        listen 443;

        ssl on;
        ssl_certificate /etc/nginx/certs/neokarma.com.pem;
        ssl_certificate_key /etc/nginx/certs/neokarma.com.key;

        server_name api.neokarma.com;

        access_log /var/log/nginx/api.neokarma.access.log;
        error_log /var/log/nginx/api.neokarma.error.log;

        location / {
                proxy_pass http://unix:/home/neokarma/sockets/api-cluster.sock:/;
        }
}
