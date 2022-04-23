import * as express from "express"

declare global {
    namespace Express {
        interface Request {
            user? : Record<string,any>;
        }
        interface User {
            discordId?: string;
            accessToken?: string;
            refreshToken?: string;
            userId?: Int;
        }
    }
}
