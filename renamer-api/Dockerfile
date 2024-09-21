FROM alpine:latest

WORKDIR /api

# Copier Cargo.toml et Cargo.lock (si présent)
COPY renamer-api .env ./

CMD ["./renamer-api"]
