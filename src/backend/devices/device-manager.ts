import {Device, LedMode} from "../database/model";
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

    public async registerDevice(macAddress: string, ipAddress: string, volume: number = 0, ledMode: LedMode = LedMode.Standard) {
        console.log(`Registering device ${macAddress} ${ipAddress}`);

        const existingDevice = this.devices.find(d => d.macAddress === macAddress);

        if (existingDevice) {
            existingDevice.ipAddress = ipAddress;
            existingDevice.isActive = true;
            existingDevice.volume = volume;
            existingDevice.ledMode = ledMode;
        } else {
            const device: Device = {
                macAddress: macAddress,
                name: DeviceManager.DEFAULT_DEVICE_NAME,
                ipAddress: ipAddress,
                isActive: true,
                volume: volume,
                ledMode: ledMode,
            };

            this.devices.push(device);
            await this.saveDevice(device);
        }
    }

    public getAllDevices() {
        return [...this.devices].sort((a, b) => Number(a.isActive) - Number(b.isActive));
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

    public getDevice(macAddress: string): Device | undefined {
        return this.devices.find(d => d.macAddress === macAddress);
    }

    public async deleteDevice(macAddress: string) {
        const index = this.devices.findIndex(d => d.macAddress === macAddress);
        this.devices.splice(index, 1);

        const db = await DB.createDBConnection();

        try {
            await DevicesRepository.deleteDevice(macAddress, db);
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    public async startDevice(macAddress: string) {
        const device: Device | undefined = this.getDevice(macAddress);

        if (device && device.isActive) {
            const data = await fetch(`http://${device.ipAddress}/api/start`, {
                method: "POST"
            });
        }
    }

    public async stopDevice(macAddress: string) {
        const device: Device | undefined = this.getDevice(macAddress);

        if (device && device.isActive) {
            const data = await fetch(`http://${device.ipAddress}/api/stop`, {
                method: "POST"
            });
        }
    }

    /*public async setDeviceSettings(macAddress: string, settings: DeviceSettings) {
        const device: Device | undefined = this.getDevice(macAddress);

        if (device && device.isActive) {
            const data = await fetch(`http://${device.ipAddress}/api/settings`, {
                method: "POST", body: JSON.stringify(settings)
            });

            if (data.ok) {
                await this.saveDevice(device);
            }
        }
    }*/
}