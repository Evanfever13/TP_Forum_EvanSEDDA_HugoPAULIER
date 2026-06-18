USE forum;

INSERT INTO users (name, email, password, date_creation, id_roles) VALUES
('Admin', 'Admin@gmail.com', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2024-06-10 00:00:00', 0),
('User', 'User@gmail.com', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2024-06-10 00:00:00', 1);

INSERT INTO threads (title, id_users) VALUES
('Thread 1', 1),
('Thread 2', 1);

INSERT INTO posts (posts, id_users, id_threads) VALUES
('Post 1', 1, 1),
('Post 2', 1, 1),
('Post 3', 1, 2);

INSERT INTO votes (id_users, id_posts, vote) VALUES
(1, 1, 1),
(1, 2, -1),
(1, 3, 1);


INSERT INTO Roles (id_roles,name) VALUES
(0,"Admin"),
(1,"User");