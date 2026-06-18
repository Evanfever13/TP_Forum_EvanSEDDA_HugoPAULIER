CREATE DATABASE IF NOT EXISTS forum;
USE forum;

-- -------------------------
-- TABLE: Roles
-- -------------------------
CREATE TABLE Roles (
    id_roles INT AUTO_INCREMENT PRIMARY KEY,
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
    id_roles INT,
    CONSTRAINT fk_id_post FOREIGN KEY (id_roles) REFERENCES Roles(id_roles)
);

-- -------------------------
-- TABLE: Threads
-- -------------------------
CREATE TABLE Threads (
    id_threads INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    id_users INT,
    CONSTRAINT fk_id_user FOREIGN KEY (id_users) REFERENCES Users(id_users)
);

-- -------------------------
-- TABLE: Posts
-- -------------------------
CREATE TABLE Posts (
    id_posts INT AUTO_INCREMENT PRIMARY KEY,
    posts TEXT NOT NULL,
    id_users INT,
    id_threads INT,
    CONSTRAINT fk_id_user FOREIGN KEY (id_users) REFERENCES Users(id_users),
    CONSTRAINT fk_id_threads FOREIGN KEY (id_threads) REFERENCES Threads(id_threads)
);

-- -------------------------
-- TABLE: Votes
-- -------------------------
CREATE TABLE Votes (
    id_votes INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT,
    id_posts INT,
    vote INT,
    CONSTRAINT fk_id_user FOREIGN KEY (id_users) REFERENCES Users(id_users),
    CONSTRAINT fk_id_posts FOREIGN KEY (id_posts) REFERENCES Posts(id_posts)
);
