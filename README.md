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

2. Node.js (v16 or higher) & npm
   ```bash
   # Check your versions
   node --version
   npm --version
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
│   │   ├── main.mo     # Main backend canister
│   │   ├── gtk_token/  # Token implementation
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

3. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Start the local Internet Computer replica:
   ```bash
   dfx start --clean --background
   ```

5. Deploy the Internet Identity canister (authentication):
   ```bash
   dfx deploy internet_identity
   ```

6. Deploy all project canisters:
   ```bash
   dfx deploy
   ```

7. Start the development server:
   ```bash
   npm start
   ```

The application should now be running at `http://localhost:4943`.

## Development Workflow

1. Start the local replica (if not already running):
   ```bash
   dfx start --clean --background
   ```

2. Make changes to the backend (Motoko):
   - Edit files in `src/backend/`
   - Redeploy the backend:
     ```bash
     dfx deploy chaincycle_backend
     ```

3. Make changes to the frontend (React):
   - Edit files in `src/frontend/`
   - The development server will automatically reload

4. Build for production:
   ```bash
   dfx deploy --network ic
   ```

## Testing

1. Run the test suite:
   ```bash
   npm test
   ```

## Troubleshooting

1. If you encounter issues with the replica:
   ```bash
   dfx stop
   dfx start --clean --background
   ```

2. If the frontend is not connecting:
   - Check that the canister IDs in `.env` match those in `dfx.json`
   - Ensure the replica is running
   - Try redeploying the canisters

3. For authentication issues:
   - Ensure the Internet Identity canister is deployed
   - Check the principal ID in the frontend console

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository.
