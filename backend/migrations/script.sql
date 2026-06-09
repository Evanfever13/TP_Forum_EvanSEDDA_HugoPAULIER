CREATE DATABASE IF NOT EXISTS forum;
USE forum;

-- -------------------------
-- TABLE: Roles
-- -------------------------
CREATE TABLE Roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- -------------------------
-- TABLE: Users
-- -------------------------
CREATE TABLE Users (
    id_users INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_role INT,
    FOREIGN KEY (id_role) REFERENCES Roles(id_role)
);

-- -------------------------
-- TABLE: Threads
-- -------------------------
CREATE TABLE Threads (
    id_thread INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    id_users INT,
    FOREIGN KEY (id_users) REFERENCES Users(id_users)
);

-- -------------------------
-- TABLE: Post
-- -------------------------
CREATE TABLE Post (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    post TEXT NOT NULL,
    id_users INT,
    id_thread INT,
    FOREIGN KEY (id_users) REFERENCES Users(id_users),
    FOREIGN KEY (id_thread) REFERENCES Threads(id_thread)
);

-- -------------------------
-- TABLE: Vote
-- -------------------------
CREATE TABLE Vote (
    id_vote INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT,
    id_post INT,
    vote INT,
    FOREIGN KEY (id_users) REFERENCES Users(id_users),
    FOREIGN KEY (id_post) REFERENCES Post(id_post)
);
