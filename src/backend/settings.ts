import * as os from "node:os";

export class Settings {
    private static instance: Settings;

    private _macAddress: string = "";
    private _ipAddress: string = "";

    public get macAddress(): string {
        return this._macAddress;
    }

    public get ipAddress(): string {
        return this._ipAddress;
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new Settings();
        }

        return this.instance;
    }

    private constructor() {
        this.getNetworkInfo();
    }

    private getNetworkInfo() {
        const interfaces = os.networkInterfaces();

        for (const name of Object.keys(interfaces)) {
            for (const net of interfaces[name]!) {
                if (net.family === 'IPv4' && !net.internal) {
                    this._macAddress = net.mac;
                    this._ipAddress = net.address;

                    return;
                }
            }
        }
    }
}