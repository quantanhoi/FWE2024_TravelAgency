Fortgeschrittene Webentwicklung Hausaufgaben mit Typescript (Backend) und React (Frontend)

```
tsc --init
npm install @mikro-orm/core \
            @mikro-orm/sqlite \
            @mikro-orm/reflection \
            fastify
npm i --save-dev @types/express
npm install --save-dev @types/jsonwebtoken
npm install --save-dev @types/bcryptjs
npm i --save-dev @types/cors

```
Structure of the database (check out src/doc/ for SQL)
![database](src/doc/database.png)


Test data to add to Reiseziel
```
{
    "name": "Kaiserdom",
    "beschreibung": "Kaiserdom Frankfurt am Main besuchen",
    "bild": "Kaiserdom.jpg",
    "startDate": "2024-06-15 12:00:00",
    "endDate": "2024-06-15 14:00:00"
}
```



test data to add to Reise
```
{
    "name": "Frankfurt am Main",
    "beschreibung": "eine Reise nach Frankfurt",
    "bild": "Frankfurt.jpg",
    "startDate": "2024-06-15 12:00:00",
    "endDate": "2024-06-17 12:00:00"
}
```


test data for user
```
{
    "email": "edward6111999@gmail.com",
    "name": "Trung Thieu",
    "password" : "12345678"
}
```
Reponse example for registering user
```
{
    "status": "Success registering user",
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVkd2FyZDYxMTE5OTlAZ21haWwuY29tIiwibmFtZSI6IlRydW5nIFRoaWV1IiwiaWF0IjoxNzE2MDMzMTQxLCJleHAiOjE3MTYwMzY3NDEsImlzcyI6Imh0dHA6Ly9md2UuYXV0aCJ9.FDoDGrFf0qq-je6PU3WTVMcL_HuxUjdfjHuqqEOLXQk"
}
```

test search Reise with Reise name or Reiseziel name and startDate, endDate at http://localhost:3001/api/reise/search
```
{
    "name": "Berlin Trip",
    "startDate": "2024-05-01 00:00:00",
    "endDate": "2024-06-31 00:00:00"
}
```
Test using Reiseziel string
```
{
    "name": "neu",
    "startDate": "2024-05-01 00:00:00",
    "endDate": "2024-06-31 00:00:00"
}
```

Procedure: test by example data, then remove/edit data startDate, endDate, name one by one then check the result



Authorization tested with JWT
![Authorization](src/doc/authorized_tested.png)

[![Watch the video](https://img.youtube.com/vi/pfWu9BR8E4s/maxresdefault.jpg)](https://youtu.be/pfWu9BR8E4s)



