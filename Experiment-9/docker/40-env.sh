#!/bin/sh
set -eu

template=/usr/share/nginx/html/env-config.template.js
target=/usr/share/nginx/html/env-config.js

envsubst '${API_BASE_URL} ${APP_TITLE} ${APP_ENV}' < "$template" > "$target"
