// services/TwitchWebSocket.ts
export class TwitchWebSocket {
    private static instance: TwitchWebSocket | null = null;
    private ws: WebSocket | null = null;
    private currentChannel: string = '';
    private pingInterval: NodeJS.Timeout | null = null;
    private messageListeners: Set<(data: string) => void> = new Set();
    private statusListeners: Set<(status: boolean) => void> = new Set();

    private constructor() {}

    static getInstance(): TwitchWebSocket {
        if (!TwitchWebSocket.instance) {
            TwitchWebSocket.instance = new TwitchWebSocket();
        }
        return TwitchWebSocket.instance;
    }

    addMessageListener(callback: (data: string) => void) {
        this.messageListeners.add(callback);
    }

    removeMessageListener(callback: (data: string) => void) {
        this.messageListeners.delete(callback);
    }

    addStatusListener(callback: (status: boolean) => void) {
        this.statusListeners.add(callback);
        // Immediately notify new listeners of current connection status
        if (this.ws) {
            callback(this.ws.readyState === WebSocket.OPEN);
        }
    }

    removeStatusListener(callback: (status: boolean) => void) {
        this.statusListeners.delete(callback);
    }

    private notifyMessageListeners(data: string) {
        this.messageListeners.forEach(listener => listener(data));
    }

    private updateStatus(status: boolean) {
        this.statusListeners.forEach(listener => listener(status));
    }

    connect(channel: string) {
        // If already connected, just change channel
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (this.currentChannel) {
                this.ws.send(`PART #${this.currentChannel}`);
            }
            this.ws.send(`JOIN #${channel}`);
            this.currentChannel = channel;
            return;
        }

        // Clean up existing connection if any
        if (this.ws) {
            this.ws.close();
        }

        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        // Create new connection
        this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv');
        this.currentChannel = channel;

        this.ws.onopen = () => {
            if (!this.ws) return;

            this.updateStatus(true);
            // Initialize chat connection
            this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            this.ws.send('PASS SCHMOOPIIE');
            this.ws.send('NICK justinfan19922');
            this.ws.send('USER justinfan19922 8 * :justinfan19922');
            this.ws.send(`JOIN #${channel}`);

            // Set up ping interval
            this.pingInterval = setInterval(() => {
                if (this.ws?.readyState === WebSocket.OPEN) {
                    this.ws.send('PING');
                }
            }, 20000);
        };

        this.ws.onmessage = (event) => {
            if (event.data.startsWith('PING')) {
                this.ws?.send('PONG');
                return;
            }
            this.notifyMessageListeners(event.data);
        };

        this.ws.onclose = () => {
            this.updateStatus(false);
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
        };

        this.ws.onerror = () => {
            this.updateStatus(false);
        };
    }

    disconnect() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.currentChannel = '';
        this.updateStatus(false);
    }
}

// Helper functions for parsing Twitch chat messages
export const parseTags = (tagString: string) => {
    if (!tagString) return {};
    return tagString.split(';').reduce((acc: Record<string, string>, tag: string) => {
        const [key, value] = tag.split('=');
        acc[key] = value;
        return acc;
    }, {});
};

export const parseEmotes = (emoteString: string) => {
    if (!emoteString) return [];
    return emoteString.split('/').map(emote => {
        const [id, positions] = emote.split(':');
        return {
            id,
            positions: positions.split(',').map(pos => {
                const [start, end] = pos.split('-');
                return { start: parseInt(start), end: parseInt(end) };
            })
        };
    });
};
