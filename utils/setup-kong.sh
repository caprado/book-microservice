#!/bin/bash

sleep 5

# Kong admin API URL
KONG_ADMIN_URL=http://kong:8001
JWT_SECRET=TEST

# Add the api service (gRPC service)
curl -X POST $KONG_ADMIN_URL/services/ \
  --data name=api \
  --data protocol=grpc \
  --data host=api \
  --data port=3001

# Add a catch-all route for the api service
curl -X POST $KONG_ADMIN_URL/services/api/routes \
  --data "paths[]=/api" \
  --data "strip_path=true" \
  --data name=api-route

# Enable the gRPC-Web plugin for the api service
curl -X POST $KONG_ADMIN_URL/services/api/plugins \
  --data name=grpc-web \
  --data "config.proto=/proto/api.proto" \
  --data "config.proto_content_type=application/grpc"

# Services and their ports
services=( "book" "order" "review" )
ports=( 3002 3003 3004 )

# Add services and routes
for index in "${!services[@]}"
do
  service=${services[$index]}
  port=${ports[$index]}

  # Add the service
  curl -X POST $KONG_ADMIN_URL/services/ \
    --data name=$service \
    --data protocol=http \
    --data url=http://$service:$port

  # Add a route to the service
  curl -X POST $KONG_ADMIN_URL/services/$service/routes \
    --data "paths[]=/$service" \
    --data name=$service-route
done

# Enable JWT plugin, rate limiting, and gRPC-Web plugin
for service in "${services[@]}"
do
  if [ "$service" != "api" ]
  then
    # Enable JWT plugin
    curl -X POST $KONG_ADMIN_URL/services/$service/plugins \
      --data name=jwt
  fi

  # Enable rate limiting
  curl -X POST $KONG_ADMIN_URL/services/$service/plugins \
    --data name=rate-limiting \
    --data config.second=5 \
    --data config.hour=10000

  # Enable gRPC-Web plugin
  curl -X POST $KONG_ADMIN_URL/services/$service/plugins \
    --data name=grpc-web \
    --data "config.proto=/proto/$service.proto"
done

# Create a consumer
curl -X POST $KONG_ADMIN_URL/consumers/ \
  --data username='consumer1'

# Associate a JWT credential
curl -X POST $KONG_ADMIN_URL/consumers/consumer1/jwt \
  --data algorithm=HS256 \
  --data secret=$JWT_SECRET

echo "Kong setup complete"
