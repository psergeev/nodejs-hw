CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    login       varchar(100) NOT NULL,
    password    varchar(100) NOT NULL,
    age         smallint NOT NULL,
    isDeleted   boolean NOT NULL
);

CREATE TABLE groups (
    id          SERIAL PRIMARY KEY,
    name        varchar(100) NOT NULL,
    permissions varchar(20) ARRAY NOT NULL,
);

CREATE TABLE userGroups (
    id          SERIAL PRIMARY KEY,
    user_id     integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    group_id    integer NOT NULL REFERENCES groups (id) ON DELETE CASCADE
);
