DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id                  SERIAL PRIMARY KEY,
    first_name          VARCHAR(255) NOT NULL,
    last_name           VARCHAR(255) NOT NULL,
    email               VARCHAR(50) NOT NULL UNIQUE,
    password_hash       VARCHAR NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_codes (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(50) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);