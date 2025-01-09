// types.ts
export interface EmotePosition {
    start: number;
    end: number;
}

export interface Emote {
    id: string;
    positions: EmotePosition[];
}

export interface Message {
    id: string;
    user: string;
    color: string;
    badges: string;
    message: string;
    emotes: Emote[];
    timestamp: Date;
}

// Badge URL mapping for common Twitch badges
export const BADGE_URLS: Record<string, string> = {
    'broadcaster/1': 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2',
    'moderator/1': 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
    'vip/1': 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1',
    'partner/1': 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1',
    'premium/1': 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1',
    'turbo/1': 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1',
    'sub-gifter/1': 'https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/1',
    'sub-gifter/50': 'https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/1',
    'sub-gifter/100': 'https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/1',
    'bits/1': 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1',
};

export interface ChatViewerProps {
    onChannelChange: (channel: string) => void;
    currentChannel: string;
    connected: boolean;
}
