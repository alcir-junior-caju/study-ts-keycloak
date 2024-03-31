DROP SCHEMA IF EXISTS keycloak cascade;
CREATE SCHEMA keycloak;
CREATE TABLE keycloak.users (
  id UUID PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  tax_id text UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
