# ChainCycle

A decentralized marketplace for circular economy materials, built on the Internet Computer.

## Features

- Material listings and bidding system
- Built-in DAO governance
- Green Score reputation system
- Token-based incentives
- Secure escrow system

## Project Structure

```
chaincycle/
├── src/
│   ├── backend/         # Motoko canister code
│   └── frontend/        # React frontend application
├── dfx.json            # Internet Computer project configuration
└── package.json        # Node.js dependencies
```

## Prerequisites

- [DFINITY SDK (dfx)](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html)
- Node.js & npm
- Internet Computer Wallet

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the local Internet Computer replica:
```bash
dfx start --clean --background
```

3. Deploy the canisters:
```bash
dfx deploy
```

## Development

- Backend (Motoko): `src/backend/`
- Frontend (React): `src/frontend/`

## Team

- UI/UX Designer
- Frontend Developer
- Motoko Backend Developer

## License

MIT
