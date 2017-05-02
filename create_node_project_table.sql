CREATE TABLE NodeProject (
    ID int IDENTITY(1,1) PRIMARY KEY,
    title varchar(255),
    author varchar(255),
    content varchar(255)
);

INSERT INTO NodeProject (title,author,content)
VALUES ('Test Title','Matthew', 'Test content');

select title, author, content from NodeProject order by ID