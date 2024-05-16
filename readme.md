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


