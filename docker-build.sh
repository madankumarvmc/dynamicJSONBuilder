set -e
SHORT_SHA=$(git rev-parse --short HEAD)

ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    docker build --platform linux/amd64 --build-arg SHORT_SHA=${SHORT_SHA} -t rest-express-app . --load

elif [ "$ARCH" = "arm64" ]; then
    docker build --build-arg SHORT_SHA=${SHORT_SHA} -t rest-express-app . 
else
    echo "Unknown architecture: $ARCH"
    exit 1
fi