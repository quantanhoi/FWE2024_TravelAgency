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