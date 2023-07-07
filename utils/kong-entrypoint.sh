#!/bin/bash
set -e

/wait-for-it.sh "$KONG_PG_HOST:5432" --timeout=2

echo "Postgres is up - running migrations"
kong migrations bootstrap

echo "Starting Kong"
/docker-entrypoint.sh kong docker-start &

KONG_PID=$!

echo "Running setup-kong.sh"
bash setup-kong.sh

# Keep script running
tail -f /dev/null & wait $KONG_PID
