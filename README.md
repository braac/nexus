# Twitch Chat Viewer

A clean, modern Twitch chat viewer built with Next.js and TypeScript. This application provides a streamlined interface for viewing Twitch chat messages in real-time, with support for badges, emotes, and user colors.

## Features

- Real-time chat message streaming using WebSocket connection
- Support for Twitch badges and user colors
- Clean, dark mode interface optimized for readability
- Dynamic channel switching
- Auto-reconnection on connection loss
- Message timestamps
- Automatic scrolling with new messages
- Responsive design that works on all screen sizes
- Connection status indicator
- Smooth animations and transitions
- Customizable interface elements
- Channel status indicators

## Tech Stack

- **Framework**: Next.js 14 with App Router and React Server Components
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui, Aceternity, and Magic UI components
- **WebSocket**: Native WebSocket API for Twitch IRC connection
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **UI Components**: Custom-built components with modern design patterns
- **Fonts**: Inter (Google Fonts)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, or pnpm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/braac/Twitch-Chat-Viewer
cd twitch-chat-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. When you first open the application, you'll see an input field at the top of the page.
2. Enter the name of any Twitch channel you want to watch.
3. Click "Join Channel" or press Enter to connect to that channel's chat.
4. The chat messages will appear in real-time, with user badges, colors, and timestamps.
5. You can switch channels at any time by entering a new channel name.

## Security Considerations

The application implements several security best practices:

1. WebSocket connection security with proper headers and authentication
2. Data sanitization for chat messages
3. Rate limiting for channel switching
4. Error boundary implementation
5. Proper error handling for connection failures

## Performance Optimizations

The application includes several optimizations:

1. Virtual scrolling for large chat rooms
2. Efficient message rendering with React memo
3. Debounced channel switching
4. Optimized WebSocket connection management
5. Smart reconnection strategy
6. Efficient badge and emote caching
7. Lazy loading of non-critical components

## Browser Support

The application is tested and supported on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile browsers are also fully supported with a responsive design that adapts to different screen sizes.