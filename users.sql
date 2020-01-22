CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    login       varchar(100) NOT NULL,
    password    varchar(100) NOT NULL,
    age         smallint NOT NULL,
    isDeleted   boolean NOT NULL
);
