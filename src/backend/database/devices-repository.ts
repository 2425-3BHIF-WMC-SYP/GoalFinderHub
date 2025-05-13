import {Device} from "./model";
import {Database} from "sqlite";

export class DevicesRepository {
    public static async getAllDevices(db: Database): Promise<Device[]> {
        const stmt = await db.prepare("select * from GOALFINDERS");
        const devices: Device[] = await stmt.all();
        await stmt.finalize();
        return devices;
    }
}