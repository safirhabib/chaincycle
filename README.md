# ChainCycle: Revolutionizing Material Trading with Blockchain

ChainCycle is a blockchain marketplace rewarding sustainable trading. Users earn CYC tokens and green scores for recycling materials. Built on Internet Computer, we make environmental responsibility profitable while building a greener future.

## 💡 Inspiration

During my time working with local recycling centers, I noticed a significant disconnect between material suppliers and potential buyers. Many valuable recyclable materials often ended up in landfills simply because there wasn't an efficient way to connect sellers with interested buyers. This observation led to the creation of ChainCycle, a decentralized marketplace that aims to bridge this gap while promoting sustainable practices.

## 🛠️ What it does

ChainCycle is a decentralized marketplace built on the Internet Computer blockchain where users can:
- List recyclable materials for sale
- Place bids on available materials
- Manage transactions with CYC tokens
- Track their trading history

The platform features:
- Secure authentication using Internet Identity
- Real-time bidding system
- Built-in token-based economy
- User profile management

## 🔨 How I built it

The project is built using:
- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Backend**: Motoko for Internet Computer canisters
- **Authentication**: Internet Identity
- **State Management**: Custom hooks and context
- **Token System**: Native CYC token implementation

The architecture follows a modular approach with separate canisters for:
- User profiles and balance management
- Marketplace listings and bids
- Token transactions

## 🏆 Challenges I ran into

1. **Blockchain Integration**: Implementing secure token transfers and balance management required careful consideration of edge cases and race conditions.

2. **Authentication Flow**: Getting Internet Identity to work smoothly with the frontend required solving several CORS and routing issues.

3. **State Management**: Ensuring consistent state across multiple canisters while maintaining good user experience was challenging.

4. **Bidding System**: Implementing a reliable bidding system that handles concurrent bids and updates in real-time required careful design.

## 📚 What I learned

- Deep understanding of Internet Computer's architecture and Motoko programming
- Best practices for building decentralized applications
- Token economy design and implementation
- Importance of user experience in blockchain applications
- State management in distributed systems

## 🚀 What's next for ChainCycle

Future plans include:
1. **Material Verification**: Implementing a verification system for material quality
2. **Smart Contracts**: Adding automated escrow and dispute resolution
3. **Mobile App**: Developing a native mobile application
4. **Analytics Dashboard**: Creating insights for trading patterns and market trends
5. **Integration**: Partnering with recycling centers and material processors

## 🔧 Technical Implementation

The project uses:
- React 18 with TypeScript
- Tailwind CSS for styling
- Internet Computer SDK (dfx version 0.24.3)
- Motoko for backend logic
- Internet Identity for authentication
- Vite for frontend tooling

## 💻 Development Setup

```bash
# Clone the repository
git clone https://github.com/safirhabib/chaincycle.git

# Install dependencies
cd chaincycle
npm install

# Start the local replica
dfx start --clean

# Deploy the canisters
dfx deploy

# Start the frontend
cd src/frontend
npm start
```
