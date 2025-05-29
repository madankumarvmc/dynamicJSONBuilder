docker container rm --force "json-builder-app" 2>/dev/null
docker run --name=json-builder-app -p 3000:3000 json-builder-app