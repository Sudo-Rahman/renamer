FROM rust:bullseye AS builder
LABEL authors="Rahman YILMAZ"

RUN apt-get update && apt-get install -y libssl-dev musl pkg-config musl-tools build-essential musl-dev && \
    rustup target add x86_64-unknown-linux-musl

WORKDIR /api/renamer-api

COPY ./renamer-api /api/renamer-api
COPY ./shared /api/shared

RUN cargo build --release --target x86_64-unknown-linux-musl

# Étape 2 : Image finale
FROM scratch AS final

# Exposer le port 3000
EXPOSE 3000

# Copier le binaire compilé depuis l'étape de construction
COPY --from=builder /api/renamer-api/target/x86_64-unknown-linux-musl/release/renamer-api usr/local/bin/renamer-api

# Exécuter le binaire
CMD ["renamer-api"]

