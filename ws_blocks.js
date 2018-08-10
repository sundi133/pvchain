const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
var express = require('express');
var router = express.Router();

//Routes will go here
module.exports = router;

router.get('/:block_id', function(req, res){
   console.log((req.params.block_id))
   db.get(++req.params.block_id, function(err, block) {
      if (err) {
         console.log('block is empty', err);
         res.send("Invalid block_id " + (req.params.block_id-1));
      } else {
         console.log(block);
         res.send(block);
      }
    });
});

router.post('/', function(req, res){
   console.log("new block contents : " + req.body.body);
   newBlock = new Block(req.body.body)
   db.get("blockHeight", function(err, blockHeight) {

      if (err) {
         //add geneis block
          console.log("Adding geneis block");
          newBlock.height = 1;
      } else {
         console.log("Previous Blockchain Height " + blockHeight);
         // New height of the block
         newBlock.height = ++blockHeight;  
      }
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      let prevBlockHeight = newBlock.height - 1;
      // Get previous block
      db.get(prevBlockHeight, function(err, blockData) {
        if (err) {
          if(prevBlockHeight > 0) {
            res.send(500);
          } 
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
            console.log('Block ' + newBlock.height + ' submission failed', err);
            res.send(500);
          } 
          else {
            db.put("blockHeight", newBlock.height, function(err) {
              if (err) {
                return console.log('New Block Height ' + "blockHeight " + 
                  newBlock.height + ' submission failed', err);
                res.send(500);
              } else {
                console.log("New Blockchain Height " + newBlock.height);
                res.send(newBlock); 
              }
            })         
          }
        })
      })   
    })
   
});


class Block{
   constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}