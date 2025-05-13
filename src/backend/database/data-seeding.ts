import {Database} from "sqlite";
import {User} from "./model";

import bcrypt from "bcrypt";

const saltRounds = 8;

export const users: User[] = [
    {
        firstName: "System",
        lastName: "Admin",
        isAdmin: true,
        username: "admin",
        password: bcrypt.hashSync("pw4admin", saltRounds),
    },
    {
        firstName: "John",
        lastName: "Doe",
        isAdmin: false,
        username: "john-doe",
        password: bcrypt.hashSync("pw4user", saltRounds),
    },
];

export async function ensureSampleDataInserted(db: Database) {
    try {
        //Insert Test Users
        const stmt = await db.prepare("INSERT INTO users (firstName, lastName, username, password, isAdmin) VALUES (?, ?, ?, ?, ?);");

        for (const user of users) {
            const existingUser = await db.get("SELECT * FROM users WHERE username = ?", user.username);

            if (existingUser === undefined) {
                await stmt.bind(user.firstName, user.lastName, user.username, user.password, user.isAdmin);
                await stmt.run();
            }
        }

        await stmt.finalize();
    } catch (e) {
        console.log(e);
    }
}