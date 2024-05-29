#!/bin/sh

# Source environment variables if the file exists
if [ -f /app/.env.local ]; then
  export $(cat /app/.env.local | grep -v ^# | xargs)
fi

# Start Supervisor
/usr/bin/supervisord -c /etc/supervisord.conf
