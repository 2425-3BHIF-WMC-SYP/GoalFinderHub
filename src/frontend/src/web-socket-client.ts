import { io, Socket } from 'socket.io-client'
import { getServerUrl } from '@/fetch-rest-endpoint.ts'

export class WebSocketClient {
	private static instance: WebSocketClient;

	private socket: Socket | undefined;

	public static getInstance() {
		if(!WebSocketClient.instance) {
			WebSocketClient.instance = new WebSocketClient();
		}

		return WebSocketClient.instance;
	}

	private constructor() {

	}

	public connect() {
		if (!this.socket) {
			try {
				this.socket = io(getServerUrl());

				this.socket.on('connect', () => {
					console.log('Verbunden mit WebSocket Server. Socket ID:', this.socket?.id);
					this.socket?.emit('register', this.socket?.id);
				});

				this.socket.on('message', (msg: string) => {
					console.log('Nachricht vom Server:', msg);
				});

				this.socket.on('connect_error', (err) => {
					console.error('❌ Verbindungsfehler:', err.message);
					alert('Server nicht erreichbar. Bitte später erneut versuchen.');
				});

				this.socket.on('disconnect', () => {
					console.log('Verbindung getrennt');
				});
			} catch (e) {
				console.error(e)
			}
		} else {
			console.log('Bereits verbunden.');
		}
	}
}
