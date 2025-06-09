import {Device} from "../database/model";
import {DB} from "../database/data";
import {DevicesRepository} from "../repos/devices-repository";

export class DeviceManager {
    private static readonly DEFAULT_DEVICE_NAME = "GoalFinder";

    private devices: Device[] = [];

    public async loadDevices() {
        const db = await DB.createDBConnection();

        try {
            this.devices = await DevicesRepository.getAllDevices(db);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            await db.close();
        }
    }

    public async registerDevice(macAddress: string, ipAddress: string) {
        console.log(`Registering device ${macAddress} ${ipAddress}`);

        const existingDevice = this.devices.find(d => d.macAddress === macAddress);

        if(existingDevice) {
            existingDevice.ipAddress = ipAddress;
            existingDevice.isActive = true;
        }
        else {
            const device: Device = {macAddress: macAddress, name: DeviceManager.DEFAULT_DEVICE_NAME, ipAddress: ipAddress, isActive: true};

            this.devices.push(device);

            const db = await DB.createDBConnection();

            try {
                await DevicesRepository.addDevice(device, db);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                await db.close();
            }
        }

        //await this.saveDevices();
    }

    public async saveDevices() {
        const db = await DB.createDBConnection();

        try {
            const stmt = await db.prepare("SELECT * FROM GOALFINDERS WHERE macAddress = ?");

            for (const device of this.devices) {
                await stmt.bind(device.macAddress);
                const existingDevice = await stmt.get<Device>();

                if(!existingDevice) {
                    await DevicesRepository.addDevice(device, db);
                }

                await stmt.reset();
            }

            await stmt.finalize();
        }
        catch (error) {
            console.error(error);
        }
        finally {
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

    public getDevice(macAddress: string) {
        return this.devices.find(d => d.macAddress === macAddress);
    }
}