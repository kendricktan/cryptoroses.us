pragma solidity ^0.4.17;

contract CryptoRoses {
  address owner;
  bytes32 name;

  struct Roses {
      bool goldRose;
      string goldMemo;
      bool whiteRose;
      string whiteMemo;
      bool pinkRose;
      string pinkMemo;
      bool redRose;
      string redMemo;
  }

  mapping (address => Roses) roseOwners;

  function CryptoRoses(bytes32 _name) public {
      owner = msg.sender;
      name = _name;
  }

  // 0.25 ETH (250000000000000000 wei) for a Gold Rose
  // 0.05 ETH (50000000000000000 wei) for a White Rose
  // 0.02 ETH (20000000000000000 wei) for a Pink rose
  // 0.01 ETH (10000000000000000 wei) for a Red Rose
  uint constant GOLD_ROSE_PRICE = 250000000000000000;
  uint constant WHITE_ROSE_PRICE = 50000000000000000;
  uint constant PINK_ROSE_PRICE = 20000000000000000;
  uint constant RED_ROSE_PRICE = 10000000000000000;

  function buyRose(string memo) public payable {
      uint amntSent = msg.value;
      address sender = msg.sender;

      if (amntSent == GOLD_ROSE_PRICE) {
          // If rose owners does not have a gold rose
          if (!roseOwners[sender].goldRose) {
              roseOwners[sender].goldRose = true;
              roseOwners[sender].goldMemo = memo;
              owner.transfer(amntSent);
          }
          // Else refund
          else {
              sender.transfer(amntSent);
          }
      }
      else if (amntSent == WHITE_ROSE_PRICE) {
          // If rose owners does not have a gold rose
          if (!roseOwners[sender].whiteRose) {
              roseOwners[sender].whiteRose = true;
              roseOwners[sender].whiteMemo = memo;
              owner.transfer(amntSent);
          }
          // Else refund
          else {
              sender.transfer(amntSent);
          }
      }
      else if (amntSent == PINK_ROSE_PRICE) {
          // If rose owners does not have a gold rose
          if (!roseOwners[sender].pinkRose) {
              roseOwners[sender].pinkRose = true;
              roseOwners[sender].pinkMemo = memo;
              owner.transfer(amntSent);
          }
          // Else refund
          else {
              sender.transfer(amntSent);
          }
      }
      else if (amntSent == RED_ROSE_PRICE) {
          // If rose owners does not have a gold rose
          if (!roseOwners[sender].redRose) {
              roseOwners[sender].redRose = true;
              roseOwners[sender].redMemo = memo;
              owner.transfer(amntSent);
          }
          // Else refund
          else {
              sender.transfer(amntSent);
          }
      }
  }

  // No refunds fam soz not soz
}
