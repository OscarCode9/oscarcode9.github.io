CREATE TABLE subscribers (
    idSubscriber int NOT NULL AUTO_INCREMENT,
    endPoint varchar(255) NOT NULL,
    publicKey varchar(255) NOT NULL,
    auth varchar(255) NOT NULL,
    PRIMARY KEY (idSubscriber)
);

