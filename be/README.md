## Usage

### Database configuration

edit config/config.json file and change your database name, username and password

```bash
{
  "development": {
    "username": "root",
    "password": "",
    "database": "api_db_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "api_db_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "api_db_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
and run this command to create database and tables
```bash
npm run prepare
```

### Run the project
```bash
npm run start:dev
```

## Model Generation

```bash
npx sequelize-cli model:generate --name user --attributes firstname:string,lastname:string,username:string,email:string,password:string,gender:string,active:integer,deleted:integer,token:string,token_expire:string,birthday:date,role:string
```