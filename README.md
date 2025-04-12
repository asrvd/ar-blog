# ARblog - Decentralized Blogging Platform

ARblog is a safe, uncensored, and decentralized blogging/microblogging platform built on the Arweave blockchain. This application allows users to create profiles, publish blog posts, and view content from other users, all stored permanently on the Arweave network.

![ARblog Screenshot](/public/image.png)

## Features

- **Decentralized Storage**: All content is stored permanently on the Arweave blockchain
- **User Profiles**: Create and manage your personalized user profile
- **Blog Publishing**: Write and publish blog posts with markdown support
- **Feed View**: Discover posts from other users
- **Wallet Integration**: Connect with Arweave-compatible wallets
- **Responsive Design**: Beautiful UI that works on mobile and desktop

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Blockchain**: Arweave
- **Authentication**: Arweave Wallet Kit
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router

## Prerequisites

To run this project locally, you need:

- Node.js (v18+)
- pnpm (v8+)
- An Arweave wallet (ArConnect or other compatible wallet extension)
- AR tokens for publishing content to the Arweave network

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arblog.git
   cd arblog
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
arblog/
├── public/            # Static assets
├── src/
│   ├── assets/        # Project assets like images
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   │   └── ArweaveProvider.tsx    # Arweave integration context
│   ├── hooks/         # Custom React hooks
│   │   └── useArweaveQueries.ts   # Arweave data fetching hooks
│   ├── lib/           # Utility functions and libraries
│   │   └── arweave.ts # Arweave interaction functions
│   ├── pages/         # Application pages
│   │   ├── Compose.tsx           # Create new blog posts
│   │   ├── Feed.tsx              # View all blog posts
│   │   ├── Post.tsx              # View single blog post
│   │   ├── Profile.tsx           # User profile page
│   │   └── PublicProfile.tsx     # View other users' profiles
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── index.html         # HTML entry point
├── package.json       # Project dependencies and scripts
└── vite.config.ts     # Vite configuration
```

## Usage

### Connect Your Wallet

1. Navigate to the app home page
2. Click on "Connect Wallet" in the navigation bar
3. Select your Arweave wallet provider
4. Accept the connection request

### Create a Profile

After connecting your wallet:

1. If you don't have a profile, a dialog will automatically appear
2. Enter your username and a short bio
3. Click "Create Profile"

### Publish a Blog Post

1. Click on "Compose" in the navigation bar
2. Fill in the title and content for your blog post
3. Add tags (optional)
4. Click "Publish"

Note: Publishing content requires AR tokens as it stores data on the Arweave blockchain

### View Your Profile

1. Click on your username or avatar in the navigation bar
2. View your profile information and published posts

## Building for Production

To create a production build:

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```bash
pnpm preview
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Arweave for providing the decentralized storage network
- Arweave Wallet Kit for wallet connection utilities
- React and the entire open-source community
