create table authority
(
    id          bigserial primary key,
    authority   varchar(50)  not null,
    description varchar(200),
    version     bigint       not null,
    created_at  timestamp    not null,
    created_by  varchar(100) not null,
    updated_at  timestamp    not null,
    updated_by  varchar(100) not null
);

create unique index uidx_auth_authority on authority (authority);

create table user
(
    id                       bigserial primary key,
    username                 varchar(100) not null,
    email                    varchar(200),
    password                 varchar(100),
    firstname                varchar(50),
    lastname                 varchar(50),
    alias                    varchar(50),
    active                   boolean,
    looked                   boolean,
    password_expiration_date timestamp,
    expiration_date          timestamp,
    activation_key           varchar(100),
    reset_key                varchar(100),
    reset_date               timestamp,
    version                  bigint       not null,
    created_at               timestamp    not null,
    created_by               varchar(100) not null,
    updated_at               timestamp    not null,
    updated_by               varchar(100) not null
);

create unique index uidx_user_username on user (username);
create unique index uidx_user_email on user (email);
create unique index uidx_user_alias on user (alias);

create table user_authority
(
    user_id      bigint,
    authority_id bigint,
    primary key (user_id, authority_id)
);

alter table user_authority
    add constraint fk_user_authority_auth foreign key (authority_id) references authority (id);
alter table user_authority
    add constraint fk_user_authority_user foreign key (user_id) references user (id);

