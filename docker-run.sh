docker container rm --force "rest-express-app" 2>/dev/null
docker run --name=rest-express-app -p 3000:3000 rest-express-app