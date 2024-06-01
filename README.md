# Sendhooks Engine API

[![Publish Docker image](https://github.com/Transfa/sendhooks-monitoring/actions/workflows/release.yml/badge.svg)](https://github.com/Transfa/sendhooks-monitoring/actions/workflows/release.yml)
[![Testing](https://github.com/Transfa/sendhooks-monitoring/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/Transfa/sendhooks-monitoring/actions/workflows/node.js.yml)
![GitHub Tag](https://img.shields.io/github/v/tag/transfa/sendhooks-monitoring)

This project is made for monitoring webhooks from the sendhooks engine. The backend is built with Express while the
frontend is made with Next.js and shadcn-ui components. ⚠️ The project is still in beta phase.

Here are the following features:

* [X] Webhooks statuses are retrieved via a Redis channel
* [X] The API provides an endpoint to retrieve the lists of Webhooks
* [X] The API provides an endpoint to retrieve details about a webhook
* [X] The Dashboard provides a page to list webhooks
* [X] The Dashboard provides a page to retrieve details about a webhook
* [ ] Users can filter the list of webhooks
* [ ] Users can see a list of statistics and graphics indicating the health of the sendhooks-engine
* [ ] The API supports authentication
* [ ] Authenticated users can access the dashboard and the API if authentication is configured on the monitoring
  application
* [ ] Authenticated users can replay webhooks
* [ ] Authenticated users can retry the sending of a webhook

After adding all these features, the project will officially move from beta.

## Requirements

To get started with this project, you'll need to set up a MongoDB database and a Redis instance. The Redis stream will
send webhook status updates, which your Express backend can listen for and use to populate the MongoDB database. By
choosing MongoDB as your database solution, you'll gain flexibility when adding new fields or data structures that might
have varying formats.

Here's an example `.env` file configuration:

```bash
BACKEND_PORT=5002
MONGODB_URI=mongodb://mongo:27017/sendhooks
REDIS_HOST=localhost
REDIS_PORT=6379
STREAM_KEY=hooks-status
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Installing

### Using Docker (Recommended)

You can directly use Docker to install and run the project.

```bash
# Run the Docker container
docker run -d -p 3000:3000 -p 5002:5002 sendhooks-engine:latest
```

If you are using `docker-compose.yaml`, you can add it in a configuration the following way.

```yaml
version: "3.9"

services:
  sendhooks-monitoring:
    container_name: sendhooks-monitoring
    env_file:
      - .env.local
    ports:
      - "5002:5002"
      - "3000:3000"

  (other services)

```

### Pulling the project

You can also directly pull the project or use the latest zip of the project.

```bash
LATEST_RELEASE_URL=$(curl -s https://api.github.com/repos/Transfa/sendhooks-monitoring/releases/latest | grep "zipball_url" | cut -d '"' -f 4)
curl -L -o latest_release.zip $LATEST_RELEASE_URL
```

Then, you must run the build commands for the backend and dashboard projects.

```bash
cd backend && npm i && npm run build
cd dashboard && npm i && npm buid
```

From that, you use the `npm start` command on each build created.

## Contributing

We welcome contributions to this project. Suggestions for improving the UI, UX, and security are also encouraged. To
contribute, you can pull the project at any time, create an ISSUE, and then submit a PR related to that issue.

We also provide a `Dockerfile.dev` for developers working with Docker. Feel free to run `docker compose up -d --build`,
which uses the `Dockerfile.dev` to run the backend and frontend in development mode.
