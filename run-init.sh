CONTAINER="mediathek-sync-db"
USER="mediatheksync"
DB="mediatheksync"

cat ./init.sql | docker exec -i $CONTAINER psql -U $USER -d $DB
