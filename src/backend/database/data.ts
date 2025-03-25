import sqlite3 from 'sqlite3'
import {open, Database} from "sqlite";
import {readFile} from "node:fs/promises";

sqlite3.verbose();

export const dbFileName = 'goalfinderhub.db';

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./database/${dbFileName}`,
            driver: sqlite3.Database
        });
        await db.run('PRAGMA foreign_keys = ON');

        await DB.ensureTablesCreated(db);

        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        try {
            const schemaFile: string = await readFile("./database/schema.sql", "utf-8");
            await connection.exec(schemaFile);
        } catch (error) {
            throw new Error(`Error creating tables: ${error}`);
        }
        /*await connection.run(
            `create table if not exists Car (
                licensePlate text not null, 
                model text not null, 
                owner text not null,
                constraint PK_Car primary key (licensePlate)
                ) strict`
        );
        await connection.run(
            `create table if not exists ParkingSpot (
                floor integer not null, 
                number integer not null, 
                car text null,
                constraint PK_ParkingSpot primary key (floor, number),
                constraint FK_ParkingSpot_Car foreign key (car) references Car(licensePlate) 
                    on delete set null
                ) strict`
        );*/

        //TODO
    }
}

