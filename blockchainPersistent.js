/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    var self = this;
    db.get("blockHeight", function(errGet, blockHeight) {
      if(errGet) {
        db.put("blockHeight", 0, function(errPut) {
        if (errPut) 
          return console.log('Unable to add block height', err);
        else
          self.addBlock(new Block("First block in the chain - Genesis block"));
        })
      }
    })  
  }

  // Add new block
  addBlock(newBlock){
    // Get Block height
    db.get("blockHeight", function(err, blockHeight) {
      console.log("Previous Blockchain Height " + blockHeight);
      // New height of the block
      newBlock.height = ++blockHeight;
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      let prevBlockHeight = newBlock.height - 1;
      // Get previous block
      db.get(prevBlockHeight, function(err, blockData) {
        if (err) {
          //console.log(err)
        }
        if (prevBlockHeight > 0) {
          let blockDataParse = JSON.parse(blockData);
          // Previous block hash
          newBlock.previousBlockHash = blockDataParse.hash;
        }

        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        // Adding block object to chain
        db.put(newBlock.height, JSON.stringify(newBlock), function(err) {
          if (err) {
            return console.log('Block ' + newBlock.height + ' submission failed', err);
          } 
          else {
            db.put("blockHeight", newBlock.height, function(err) {
              if (err) {
                return console.log('New Block Height ' + "blockHeight " + 
                  newBlock.height + ' submission failed', err);
              } else {
                console.log("New Blockchain Height " + newBlock.height); 
              }
            })         
          }
        })
      })   
    })
  }

  // Get block height
  getBlockHeight(){
    db.get("blockHeight", function(err, blockHeight) {
      if (err) {
        return console.log('block is empty', err);
      } else {
        console.log(blockHeight);
        return blockHeight;
      }
    });  
  }

  // Get block
  getBlock(blockHeight){
    // Return object as a single string
    db.get(blockHeight, function(err, block) {
      if (err) {
        return console.log('block is empty', err);
      } else {
        console.log(block);
        return JSON.parse(JSON.stringify(block));
      }
    });  
  }

  // validate block
  validateBlock(blockHeight){
    // get block object
    db.get(blockHeight, function(err, blockData) {
      if (err) {
        return console.log('block is empty', err);
      } else {
        console.log(blockData);
        let block = JSON.parse(blockData);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
            console.log("Valid Hash for block # " + blockHeight)
            return true;
          } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
          }
        }
      });  
    
  }

  
  // Validate blockchain
  validateChain(){
    let errorLog = [];
    let verifyChain = async () => {
      let blockHeight = await db.get('blockHeight');
      let verifyBlocks = async () => { 
        let result = [];
        for (let blockPosition = 1; blockPosition <= blockHeight; blockPosition++) {
            db.get(blockPosition, function(err, blockData) {
            // Validate block
            let block = JSON.parse(blockData);
            // Get block hash
            let blockHash = block.hash;
            // Remove block hash to test block integrity
            block.hash = '';
            // Generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
            // Compare
            if (blockHash===validBlockHash) {
                console.log("Valid Hash for block # " + blockPosition);
            } else {
                console.log('Block #'+blockPosition+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                errorLog.push(blockPosition);
            }
            // Verify next hash in chain, ignore last block as last block dont have a next block
            if (blockPosition < blockHeight) {
              let nextBlockPosition = blockPosition+1;
              db.get(nextBlockPosition, function(err, blockDataNext) {
                let blockNext = JSON.parse(blockDataNext);
                // Get Previous Block Hash
                let blockNextHash = blockNext.previousBlockHash;      
                if (blockHash!==blockNextHash) {
                  errorLog.push(blockPosition);
                }
                if (errorLog.length>0) {
                  console.log('Block errors = ' + errorLog.length);
                  console.log('Blocks: '+errorLog);
                } else {
                  console.log('Valid Chain Linked at block ' + blockPosition);
                }
              })
            } 
          })
        } 
        return errorLog;
      }
      await verifyBlocks();
    }
    verifyChain();
  }
}
