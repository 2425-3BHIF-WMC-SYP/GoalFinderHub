export interface User {
  username: string;
  password: string
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface Device {
  macAddress: string
  name: string
  volume?: number
  ledMode?: string
}

export interface Team {
  id: number;
  name: string;
  players: string[];
}

export interface Settings {
  macAddress: string;
  ipAddress: string;
}
