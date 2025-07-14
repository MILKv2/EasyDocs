# THIS PROJECT IS UNDER DEVELOPMENT

# EasyDocs

A modern documentation platform built with React, TypeScript, Vite and Shadcn deployed on Cloudflare Pages.

## Features

- ⚡ Fast development with Vite and Hot Module Replacement (HMR)
- 🎯 Type-safe development with TypeScript
- ⚛️ React 19 with modern hooks and components
- 🚀 Deployed on Cloudflare Pages for global performance
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Deployment**: Cloudflare Pages
- **Development**: ESLint, Hot Module Replacement

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MILKv2/easydocs
   cd easydocs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deployment

### Cloudflare Pages Setup

1. **Install Wrangler CLI** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy to Cloudflare Pages**
   ```bash
   npm run deploy
   ```

### Environment Configuration

For production deployments, configure your environment variables and secrets using Cloudflare's secure methods:

1. **Using Wrangler for secrets**:
   ```bash
   wrangler pages secret put SECRET_NAME
   ```

2. **Using the Cloudflare Dashboard**:
   - Go to your Pages project
   - Navigate to Settings → Environment variables
   - Add your production variables

⚠️ **Security Note**: Never commit sensitive data like API keys, tokens, or passwords to version control. Use Cloudflare's built-in secrets management.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Cloudflare Pages
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This project follows security best practices:
- No hardcoded secrets or API keys
- Environment variables managed through Cloudflare
- Dependencies regularly updated
- Secure deployment pipeline

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
