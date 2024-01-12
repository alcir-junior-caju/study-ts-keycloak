drop schema if exists keycloak cascade;
create schema keycloak;
create table keycloak.users (
    id uuid primary key,
    name text not null,
    email text not null unique,
    password text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);
