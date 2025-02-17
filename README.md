# ChainCycle

A decentralized marketplace for circular economy materials, built on the Internet Computer.

## Features

- Material listings and bidding system
- Built-in DAO governance
- Green Score reputation system
- Token-based incentives
- Secure escrow system

## Prerequisites

Before you begin, ensure you have the following installed:

1. [DFINITY SDK (dfx)](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html)
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
   Verify installation:
   ```bash
   dfx --version  # Should be 0.24.3 or higher
   ```

2. Node.js (v16 or higher) & npm
   ```bash
   # Check your versions
   node --version  # Should be v16.x or higher
   npm --version   # Should be 8.x or higher
   ```

3. Git
   ```bash
   git --version
   ```

## Project Structure

```
chaincycle/
├── src/
│   ├── backend/         # Motoko canister code
│   │   ├── main.mo     # Main backend canister (DAO & Proposals)
│   │   ├── gtk_token/  # Token implementation
│   │   ├── marketplace/ # Marketplace functionality
│   │   └── user_profile/ # User profile management
│   ├── frontend/       # React frontend application
│   └── declarations/   # Generated type declarations
├── dfx.json           # Internet Computer project configuration
└── package.json       # Node.js dependencies
```

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/safirhabib/chaincycle.git
   cd chaincycle
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local Internet Computer replica:
   ```bash
   dfx start --clean --background
   ```
   If you see any errors about ports in use:
   ```bash
   dfx stop
   pkill dfx
   dfx start --clean --background
   ```

4. Deploy the Internet Identity canister (authentication):
   ```bash
   dfx deploy internet_identity
   ```

5. Deploy all project canisters:
   ```bash
   dfx deploy
   ```
   This will:
   - Build and deploy all backend canisters
   - Generate type declarations
   - Deploy the frontend canister

6. Start the development server:
   ```bash
   npm start
   ```

The application should now be running at `http://localhost:5173` (Vite dev server) or `http://localhost:4943` (IC replica).

## Development Workflow

1. Start the local replica (if not already running):
   ```bash
   dfx start --clean --background
   ```

2. Make changes to the backend (Motoko):
   - Edit files in `src/backend/`
   - Redeploy the modified canister:
     ```bash
     # Deploy a specific canister
     dfx deploy <canister_name>  # e.g., dfx deploy marketplace
     
     # Or deploy all canisters
     dfx deploy
     ```

3. Make changes to the frontend (React):
   - Edit files in `src/frontend/`
   - The development server will automatically reload

4. Build for production:
   ```bash
   dfx deploy --network ic
   ```

## Common Issues & Troubleshooting

1. Authentication Issues:
   - Ensure Internet Identity canister is deployed and running
   - Check browser console for any CORS errors
   - Verify the II canister ID in `.env` matches the deployed canister
   - Try clearing browser cache and cookies

2. Backend Connection Issues:
   ```bash
   # Stop and restart the replica
   dfx stop
   dfx start --clean --background
   
   # Redeploy all canisters
   dfx deploy
   
   # Verify canister IDs
   dfx canister id internet_identity
   dfx canister id chaincycle_backend
   ```
   
3. Frontend Development Issues:
   - Ensure all dependencies are installed: `npm install`
   - Check for TypeScript errors: `npm run type-check`
   - Verify environment variables in `.env`
   - Try rebuilding declarations: `dfx generate`

4. Proposal Creation Issues:
   - Ensure you have a user profile created
   - Check that you have enough GTK tokens
   - Verify your principal ID in the frontend console

5. Port Conflicts:
   ```bash
   # Check for processes using required ports
   lsof -i :4943
   lsof -i :5173
   
   # Kill any conflicting processes
   pkill dfx
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Open a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Environment details (OS, dfx version, node version)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
