insert into authority (id, authority, version, created_at, created_by, updated_at, updated_by)
values (1, 'ROLE_USER', 1, current_timestamp, 'script', current_timestamp, 'script');
insert into authority (id, authority, version, created_at, created_by, updated_at, updated_by)
values (2, 'ROLE_ADMIN', 1, current_timestamp, 'script', current_timestamp, 'script');

insert into user(id, username, password, email, active, version, created_at, created_by, updated_at, updated_by)
values (1, 'user', '{bcrypt}$2a$10$uClRWLA7uDq6cSaWJ1ZG7OqLayL45CfstOLkZz1c4ct.KTxV2rx3m', 'user@example.com',
        true, 1, current_timestamp, 'script', current_timestamp, 'script'); -- user/user
insert into user(id, username, password, email, active, version, created_at, created_by, updated_at, updated_by)
values (2, 'admin', '{bcrypt}$2a$10$x0geN0s8rnMtPPEG7QhnN.UHbS.FU7RLifPiM.wTObIQ7C9OBT7Qq', 'admin@example.com',
        true, 1, current_timestamp, 'script', current_timestamp, 'script'); -- admin/admin

insert into user_authority (authority_id, user_id)
values (1, 1);
insert into user_authority (authority_id, user_id)
values (1, 2);
insert into user_authority (authority_id, user_id)
values (2, 2);

