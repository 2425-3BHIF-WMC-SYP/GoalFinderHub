import {Database} from "sqlite";
import {User} from "../database/model";

export class UsersRepository {
    public static async GetUser(db: Database, username: string): Promise<User | undefined> {
        const stmt = await db.prepare("SELECT * FROM USERS WHERE username = ?");
        const user: User | undefined = await stmt.get<User>(username);
        await stmt.finalize();
        return user;
    }
}