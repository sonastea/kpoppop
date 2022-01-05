# K-POP Meme based site created with React NestJS Node and Prisma

## Required Files

❗️Important: Needed to run the server or it will not compile!

```bash
├── kpoppop
│
├── client\
│       ├── `.env`
│
├── server\
│       ├── secrets\
│       │       ├── `private-key.pem`
│       │       ├── `public-certificate.pem`
│       ├── `.env`
│       ├── `firebaseCredentials.json`
│
├── `database.env`
```

<br>

Reference for creating [ssl certificate](https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl).

```c
# client/.env
        ⭕ REACT_APP_API_URL // Endpoint that serves images

# server/.env
        🔴 DATABASE_URL         // Connection string to reach the database from the server's side.
        🔴 JWT_SECRET_KEY       // Random x bytes in hex to sign and
        🔴 JWT_REFRESH_KEY      // decode json web token
        🔴 STORAGE_BUCKET       // Endpoint that images are saved with firebase storage.
        🔴 NODE_ENV             // Defaults to 'production', takes 'test' or 'development'

# server/firebaseCredentials.json
        // Credentials that authorize user to access the firebase storage buckets.
        🔴 firebaseCredentials.json 📄

# server/secrets/
        // Self-signed certs to run server as https
        🔴 private-key.pem          📄
        🔴 public-certificate.pem   📄

# database.env
        🔴 POSTGRES_USER                // User to login postgresql db
        🔴 POSTGRES_PASSWORD            // Password to login postgresql db
        🔴 POSTGRES_DB                  // Database name that stores the schemas.
```
