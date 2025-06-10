import {Device} from "../database/model";
import {DB} from "../database/data";
import {DevicesRepository} from "../repos/devices-repository";

export class DeviceManager {
    private static readonly DEFAULT_DEVICE_NAME = "GoalFinder";

    private static instance: DeviceManager;

    private devices: Device[] = [];

    public static getInstance(): DeviceManager {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    private constructor() {
    }

    public async loadDevices() {
        const db = await DB.createDBConnection();

        try {
            this.devices = await DevicesRepository.getAllDevices(db);
        } catch (error) {
            console.log(error);
        } finally {
            await db.close();
        }
    }

    public async registerDevice(macAddress: string, ipAddress: string) {
        console.log(`Registering device ${macAddress} ${ipAddress}`);

        const existingDevice = this.devices.find(d => d.macAddress === macAddress);

        if (existingDevice) {
            existingDevice.ipAddress = ipAddress;
            existingDevice.isActive = true;
        } else {
            const device: Device = {
                macAddress: macAddress,
                name: DeviceManager.DEFAULT_DEVICE_NAME,
                ipAddress: ipAddress,
                isActive: true
            };

            this.devices.push(device);
            await this.saveDevice(device);
        }
    }

    public async saveDevices() {
        const db = await DB.createDBConnection();

        try {
            const stmt = await db.prepare("SELECT * FROM GOALFINDERS WHERE macAddress = ?");

            for (const device of this.devices) {
                await stmt.bind(device.macAddress);
                const existingDevice = await stmt.get<Device>();

                if (!existingDevice) {
                    await DevicesRepository.addDevice(device, db);
                }

                await stmt.reset();
            }

            await stmt.finalize();
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    public getAllDevices() {
        return [...this.devices].sort((a, b) => {
            const aPriority = a.isActive === true ? 2 : a.isActive === false ? 1 : 0;
            const bPriority = b.isActive === true ? 2 : b.isActive === false ? 1 : 0;
            return bPriority - aPriority;
        });
    }

    public async saveDevice(device: Device): Promise<void> {
        const db = await DB.createDBConnection();

        try {
            if (await DevicesRepository.deviceExists(device.macAddress, db)) {
                await DevicesRepository.updateDevice(device.macAddress, db, device.name);
            } else {
                await DevicesRepository.addDevice(device, db);
            }

        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    public getDevice(macAddress: string): Device | undefined{
        return this.devices.find(d => d.macAddress === macAddress);
    }

    public async deleteDevice(macAddress: string) {
        const index = this.devices.findIndex(d => d.macAddress === macAddress);
        this.devices.splice(index, 1);

        const db = await DB.createDBConnection();

        try {
            await DevicesRepository.deleteDevice(macAddress, db);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await db.close();
        }
    }

    public async startDevice(macAddress: string) {
        const device: Device | undefined = this.getDevice(macAddress);

        if(device !== undefined && device.isActive) {
            const data = await fetch(`http://${device.ipAddress}/api/start`, {
                method: "POST"
            });
        }
    }

    public async stopDevice(macAddress: string) {
        const device: Device | undefined = this.getDevice(macAddress);

        if(device !== undefined && device.isActive) {
            const data = await fetch(`http://${device.ipAddress}/api/stop`, {
                method: "POST"
            });
        }
    }
}