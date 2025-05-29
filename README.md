# Project Name: rest-express

This project uses Docker for containerization. Below are the instructions to build and run the Docker image.

## Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) installed on your system.

## Development

To start the development server (outside of Docker):
```sh
npm run dev
```

## Available Scripts (from package.json)

*   `npm run dev`: Starts the development server using `tsx`.
*   `npm run build`: Builds the frontend with Vite and the backend server with esbuild.
*   `npm run start`: Starts the production server (expects `dist/index.js` to exist).
*   `npm run check`: Runs TypeScript checks.
*   `npm run db:push`: Pushes database schema changes using Drizzle Kit.


## Building the Docker Image

You can build the Docker image using the provided script or manually with the Docker CLI.

**Using the script:**

Make sure the script is executable:
```sh
chmod +x docker-build.sh
```
Then run the script:
```sh
./docker-build.sh
```

**Manually with Docker CLI:**

Open your terminal in the project root directory (where the `Dockerfile` is located) and run:
```sh
docker build -t rest-express-app .
```
You can replace `rest-express-app` with your preferred image name.

## Running the Docker Image

Once the image is built, you can run it using the provided script or manually.

**Using the script:**

Make sure the script is executable:
```sh
chmod +x docker-run.sh
```
Then run the script:
```sh
./docker-run.sh
```
This script might contain pre-configured port mappings and environment variables. Check the script content for details.

**Manually with Docker CLI:**

To run the container:
```sh
docker run -p 3000:3000 --name rest-express-container rest-express-app
```
Breakdown of the command:
*   `-p 3000:3000`: Maps port 3000 of the host to port 3000 of the container (assuming your application inside the container listens on port 3000, as per your Dockerfile `EXPOSE 3000`). Adjust if your application uses a different port.
*   `--name rest-express-container`: Assigns a name to your running container for easier management.
*   `rest-express-app`: The name of the image you built.

Your application should now be accessible at `http://localhost:3000` (or the host port you mapped).

## Stopping and Removing the Container

To stop the container:
```sh
docker stop rest-express-container
```

To remove the container (after it's stopped):
```sh
docker rm rest-express-container
```

## Cleaning up Docker Resources

You might have a `docker-cleanup.sh` script. If so, make it executable and run it to remove related Docker images or containers:
```sh
chmod +x docker-cleanup.sh
./docker-cleanup.sh
```
Alternatively, to remove the image:
```sh
docker rmi rest-express-app
```