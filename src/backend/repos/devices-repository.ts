import {Device} from "../database/model";
import {Database} from "sqlite";

export class DevicesRepository {
    public static async getAllDevices(db: Database): Promise<Device[]> {
        const stmt = await db.prepare("select * from GOALFINDERS");
        const devices: Device[] = await stmt.all();
        await stmt.finalize();
        return devices;
    }

    public static async getDeviceByMacAddress(db: Database, macAddress: string): Promise<Device | undefined> {
        const stmt = await db.prepare("SELECT * FROM GOALFINDERS WHERE MacAddress = ?1");
        await stmt.bind(macAddress);
        const device: Device | undefined = await stmt.get();
        await stmt.finalize();
        return device;
    }

    public static async addDevice(device: Device, db: Database): Promise<Device> {
        try {
            const stmt = await db.prepare("INSERT INTO GOALFINDERS (MacAddress, NAME) VALUES (?1, ?2)");
            await stmt.bind({
                1: device.macAddress,
                2: device.name
            });
            await stmt.run();
            await stmt.finalize();
        } catch (error) {
            console.error("Error adding device:", error);
            throw error;
        }

        return device;
    }

    public static async deleteDevice(macAddress: string, db: Database): Promise<string> {
        try {
            console.log(macAddress);
            const stmt = await db.prepare("DELETE FROM GOALFINDERS WHERE macAddress = ?1");
            await stmt.bind(macAddress);
            const result = await stmt.run();
            await stmt.finalize();
        } catch (error) {
            console.error("Error deleting device:", error);
            throw error;
        }

        return macAddress;
    }

    public static async updateDevice(oldMacAddress: string, db: Database, name: string): Promise<void> {
        if (!name) {
            throw new Error("No name provided to update.");
        }

        const sql = `UPDATE GOALFINDERS SET Name = ? WHERE MacAddress = ?`;

        try {
            const stmt = await db.prepare(sql);
            await stmt.run(name, oldMacAddress);
            await stmt.finalize();
        } catch (error) {
            console.error("Error updating device:", error);
            throw error;
        }
    }

    public static async deviceExists(macAddress: string, db: Database): Promise<boolean> {
        try {
            const result = await db.get(
                'SELECT 1 FROM GOALFINDERS WHERE MacAddress = ? LIMIT 1',
                [macAddress]
            );

            return !!result;
        } catch (error) {
            console.error('Error checking device existence:', error);
            throw error;
        }
    }

}