[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)
# AssignmentTemplate

## Getting Started

### Installation

1. Install a stable version of NodeJS. The active LTS or current version should work fine.
2. Install Docker.

- macOS and Windows users can install [Docker Desktop](https://www.docker.com/products/docker-desktop) which contains both Docker and Docker-Compose tools.
- Linux users need to follow the instructions on [Get Docker CE for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and then [Install Docker Compose](https://docs.docker.com/compose/install/) separately.
- You are good to go when you can successfully run:
  `docker-compose --version`

3. Install ModHeader.

- To test our API, we use [Google Chrome](https://www.google.com/chrome/) with the [ModHeader extension](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj?hl=en).

4. Run `git clone <url>` to clone the repository and navigate to it using `cd` in your command line or shell tool.
5. Run `yarn --cwd frontend/ install` to install all dependencies for frontend.
6. Run `mkdir pgdata` to create a directory that is used to persist data generated by and used by `db` container. (NOT YET AVAILABLE, SKIP THIS FOR NOW)
7. Run `docker compose up --build` to create and run all containers.

- To run a specific service, please refer to [this section](#useful-commands).
- It might take a while for all the servers to be ready when you are running it for the first time. (so please be patient ^.^)

9. Point your browser to http://localhost:3000 to access the frontend.
10. Point your browser to http://localhost:5000 to access the backend. (NOT YET AVAILABLE)

## Development

### Docker Services

1. `api` running backend server (NOT YET AVAILABLE)
2. `db` running postgresql server (NOT YET AVAILABLE)
3. `client` running frontend server

### Useful Commands

- `docker exec -it <container> sh`: to access a running container (Note: this container must be running before you can do this)
- `docker compose run <service> sh -c "<command>"`: to run a one-time command against a service
- `docker compose run --service-ports <service>`: to run a specific service

### Branch Conventions

- `master` is release branch and should remain stable at all times.
- Create feature branches for your in-progress features and using the format `<username>/my-feature` (doesn't have to be your GitHub username, just use something identifiable and be consistent about it).
- We use a variation of Conventional Commits specification for commit messages:
- Use `[service] feat: my commit message` instead of `feat: my commit message`.

### Commit Conventions

Prefix your commits with these identifiers for better organization of Git history - `<identifier-service> <commit message>`. For example: `[user-service] feat: build oauth protocol`.

- `[frontend]` - frontend changes
- `[user-service]` - backend changes
- `[misc]` - miscellaneous changes

### Working with compose
- build-dev.sh to build the services locally
- docker compose -f docker-compose-dev.yml up to compose the dev environment which uses binded volumes for the app code and node modules from the corresponding directory. **REQUIRED NODE DEPENDENCIES MUST ALWAYS BE INSTALLED TO USE docker-compose-dev

### Testing the app
- `./clean-compose.sh <compose-file>` to compose the app cleanly.
- The compose file for each assignment is within the /assignment-compose folder. ie. Simply run `./clean-compose.sh assignment-compose/docker-compose-A2-3.yml` for A2, A3 and A4 to start up the app. 
- Required env file is to be copied to the corresponding folder
  - Frontend: frontend/.env
  - Backend Servies: backend/microservices/<service>/.env