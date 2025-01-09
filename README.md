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

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadcN/UI components
- **WebSocket**: Native WebSocket API for Twitch IRC connection
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, or pnpm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twitch-chat-viewer.git
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

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. When you first open the application, you'll see an input field at the top of the page.
2. Enter the name of any Twitch channel you want to watch (without the # symbol).
3. Click "Join Channel" or press Enter to connect to that channel's chat.
4. The chat messages will appear in real-time, with user badges, colors, and timestamps.
5. You can switch channels at any time by entering a new channel name.

## Project Structure

```
braac-Twitch-Chat-Viewer/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/            # React components
│   ├── TwitchChatViewer.tsx  # Main chat viewer component
│   └── ui/               # UI components
│       └── alert.tsx     # Alert component
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

## Key Components

### TwitchChatViewer.tsx

This is the main component that handles:
- WebSocket connection to Twitch IRC
- Message parsing and formatting
- User interface rendering
- Channel switching
- Connection status management
- Auto-scrolling behavior

### Interface Types

```typescript
interface Message {
  id: string;
  user: string;
  color: string;
  badges: string;
  message: string;
  emotes: Emote[];
  timestamp: Date;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Twitch IRC documentation for chat connection specifications
- ShadcN/UI for the component library
- Tailwind CSS for the styling system
- Next.js team for the amazing framework

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Ensure your OAuth token is valid and properly configured
   - Check if the channel name is spelled correctly
   - Verify your internet connection

2. **Missing Badges**
   - Some badges might not load if the CDN is unreachable
   - Verify that the badge URLs are correct

3. **Performance Issues**
   - If the chat becomes slow, try reducing the maximum number of stored messages
   - Ensure your browser is up to date

## Security Considerations

Currently, the Twitch OAuth token is hardcoded in the `TwitchChatViewer.tsx` component. For production use, it's recommended to:

1. Implement proper OAuth flow with Twitch authentication
2. Store sensitive credentials in environment variables
3. Handle token refresh and expiration
4. Add rate limiting for channel switching
5. Implement proper error handling for authentication failures

## Future Improvements

- Add proper OAuth authentication flow
- Add support for Twitch emotes
- Implement message filtering options
- Add user timeout and ban information
- Support for chat commands
- Add message search functionality
- Implement chat replay functionality
- Add support for BetterTTV and FrankerFaceZ emotes