psql_start_local:
		@bash -c "docker compose -f docker-compose.yml down && docker compose -f docker-compose.yml up -d"
