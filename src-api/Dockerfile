FROM rust:1.81.0-slim

WORKDIR /api

# Copier Cargo.toml et Cargo.lock (si présent)
COPY Cargo.toml Cargo.lock* .env ./

# Copier le répertoire src
COPY src ./src

RUN cargo build --release


CMD ["cargo", "run", "--release"]
