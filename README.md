## Getting Started

* Add file <a href="https://raw.githubusercontent.com/piriya-online/api/eb6e034005c8ad40507017e64feaf6f3003a9b91/config.js" target="_blank">config.js</a> to your project.
* Add data to table Api with this command
```
INSERT INTO Api (apiKey, secretKey, name, description, type, website, addBy)
SELECT NEWID(), 'abc123', 'My API', 'My API Description', 'web', 'test.domain.com', 'Me'
```
