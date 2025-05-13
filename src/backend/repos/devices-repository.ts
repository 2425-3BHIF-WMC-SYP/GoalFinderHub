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
        const stmt = await db.prepare("select * from GOALFINDERS where MacAddress = ?");
        const device: Device | undefined = await stmt.get(macAddress);
        await stmt.finalize();
        return device;
    }

    public static async addDevice(db: Database, device: Device): Promise<void> {
        const stmt = await db.prepare("insert into GOALFINDERS (MacAddress, Name) values (?, ?)");
        await stmt.bind(device.macAddress, device.name);
        await stmt.run();
        await stmt.finalize();
    }
}