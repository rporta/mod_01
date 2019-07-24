#!/bin/bash

cd /var/node/dale

case "$1" in
        stop|restart)
                forever $1 server.js
                forever $1 billing.js
                ;;
        *)
		forever -al /mnt/backup/logs/node/dale/server.log $1 server.js auy
		forever -al /mnt/backup/logs/node/dale/billing.log $1 billing.js auy

		exit 1
esac
