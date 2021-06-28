
# Slimme Meter Dashboard

Smart meter reading dashboard for Dutch meters with a P1 port.
The dashboard is written in Dutch.

Application is written in NodeJS (API) React (Frontend) Python (Fetcher & Parser)

***The Application is packed in docker containers***

#### Suppported DSMR versions

- DSMR v2.2
- Soon more

## Installation

Use [docker](https://www.docker.com/) for compiling & building the Dashboard environment

```bash
cd /dashboard
docker-compose build && docker-compose up
```

## Usage
After running docker visit ```http://localhost:3000```


## License
[MIT](https://choosealicense.com/licenses/mit/)
