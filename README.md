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

\
Reference for creating [ssl certificate](https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl).

```c
# client/.env
        ⭕ VITE_API_URL         // Endpoint that serves images.
        ⭕ VITE_MESSAGES_WS_URL // Endpoint for message websocket connection. Typically wss://{API}
        🔴 VITE_SITE_KEY        // ReCAPTCHA key to invoke reCATPCHA service.

# server/.env
        🔴 DATABASE_URL         // Connection string to reach database.
        🔴 SESSION_SECRET_KEY   // Random x bytes to sign session cookies.
        🔴 STORAGE_BUCKET       // Endpoint that images are saved with firebase storage.
        🔴 NODE_ENV             // Defaults to 'production', takes 'test' or 'development'.
        🔴 RECAPTCHA_SECRET     // Verifies invoked recaptcha response from clients.
        ⭕ REDIS_URL            // Redis Service Pub/Sub for web socket messages.
        🔴 DISCORDBOT_TOKEN
        🔴 DISCORDBOT_WEBHOOK
        🔴 DISCORD_GUILD_ID
        🔴 DISCORD_CHANNEL_ID
        🔴 DISCORD_CLIENT_ID
        🔴 DISCORD_CLIENT_SECRET
        🔴 DISCORD_CALLBACK_URL
        🔴 THROTTLE_TTL
        🔴 THROTTLE_LIMIT

# server/firebaseCredentials.json
        // Credentials that authorize user to access the firebase storage buckets.
        🔴 firebaseCredentials.json 📄

# server/secrets/
        // Self-signed certs to run server as https
        🔴 private-key.pem          📄
        🔴 public-certificate.pem   📄

# database.env
        // Used in creation of database:kpoppop_db in docker-compose.
        🔴 POSTGRES_USER                // User to login postgresql db.
        🔴 POSTGRES_PASSWORD            // Password to login postgresql db.
        🔴 POSTGRES_DB                  // Database name that stores the schemas.
```
