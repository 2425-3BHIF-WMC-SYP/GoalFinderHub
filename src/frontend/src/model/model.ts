export interface User {
  username: string;
  password: string
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface Settings {
  macAddress: string;
  ipAddress: string;
}
