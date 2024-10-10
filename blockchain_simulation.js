// Import the crypto library to create hashes
const crypto = require('crypto');

// Define a Block class to represent each block in the blockchain
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index; // Block's position in the chain (0, 1, 2, ...)
    this.timestamp = timestamp; // Time the block was created
    this.data = data; // Transaction or data stored in the block
    this.previousHash = previousHash; // The hash of the previous block in the chain
    this.hash = this.calculateHash(); // The hash of the current block (calculated)
  }

  // A method to calculate the hash of the current block
  calculateHash() {
    return crypto.createHash('sha256').update(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)
    ).digest('hex'); // Use SHA-256 hash function to create a unique hash
  }
}

// Define a Blockchain class to simulate the blockchain
class Blockchain {
  constructor() {
    // Create the first block (genesis block) when the blockchain is initialized
    this.chain = [this.createGenesisBlock()];
  }

  // Method to create the first block (genesis block)
  createGenesisBlock() {
    return new Block(0, "01/01/2024", "Genesis Block", "0"); // Block 0 with some initial data
  }

  // Method to get the latest block in the blockchain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Method to add a new block to the blockchain
  addBlock(newBlock) {
    // Set the previous hash of the new block to the hash of the latest block
    newBlock.previousHash = this.getLatestBlock().hash;
    // Calculate the hash of the new block with the updated previous hash
    newBlock.hash = newBlock.calculateHash();
    // Add the new block to the chain
    this.chain.push(newBlock);
  }

  // Method to validate the integrity of the blockchain
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if the current block's hash is correct
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if the current block's previous hash matches the previous block's hash
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true; // If all blocks are valid, return true
  }
}

// Create a new instance of Blockchain (our blockchain simulation)
let myCoin = new Blockchain();

// Add new blocks (simulate transactions or data being added)
myCoin.addBlock(new Block(1, "02/10/2024", { amount: 4 })); // Block with some data
myCoin.addBlock(new Block(2, "03/10/2024", { amount: 10 })); // Another block with data

// Output the blockchain and validate it
console.log(JSON.stringify(myCoin, null, 4)); // Display the blockchain in readable format
console.log("Is blockchain valid? " + myCoin.isChainValid()); // Check if blockchain is valid

// Example of tampering with the data (to show how blockchain validation works)
myCoin.chain[1].data = { amount: 100 }; // Trying to change data in block 1
myCoin.chain[1].hash = myCoin.chain[1].calculateHash(); // Recalculate hash to cover up tampering

console.log("Is blockchain valid after tampering? " + myCoin.isChainValid()); // Check validity again