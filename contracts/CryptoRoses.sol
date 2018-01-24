pragma solidity ^0.4.17;

contract CryptoRoses {
  address owner;
  bytes32 name;

  enum Rose { Gold, White, Pink, Red }

  struct RoseOwner {
      bool hasRose;
      Rose roseType;
      string memo;
  }

  mapping (bytes32 => RoseOwner) roseOwners;

  function CryptoRoses(bytes32 _name) public {
      owner = msg.sender;
      name = _name;
  }

  // 0.25 ETH (250000000000000000 wei) for a Gold Rose
  // 50 Garlicoin for a Gold Rose

  // 0.05 ETH (50000000000000000 wei) for a White Rose
  // 10 Garlicoin for a White Rose

  // 0.02 ETH (20000000000000000 wei) for a Pink rose
  // 4 Garlicoin for a Pink Rose

  // 0.01 ETH (10000000000000000 wei) for a Red Rose
  // 2 Garlicoin for a Red Rose

  uint constant ETH_GOLD_ROSE_PRICE = 250000000000000000;
  uint constant ETH_WHITE_ROSE_PRICE = 50000000000000000;
  uint constant ETH_PINK_ROSE_PRICE = 20000000000000000;
  uint constant ETH_RED_ROSE_PRICE = 10000000000000000;

  // Buy Rose with ETH
  function buyRoseETH(string memo) public payable {
      uint amntSent = msg.value;
      address sender = msg.sender;
      bytes32 senderHash = sha256(sender);

      Rose roseType;

      // Assign rose 
      if (amntSent >= ETH_GOLD_ROSE_PRICE) {
          roseType = Rose.Gold;
      } else if (amntSent >= ETH_WHITE_ROSE_PRICE) {
          roseType = Rose.White;
      } else if (amntSent >= ETH_PINK_ROSE_PRICE) {
          roseType = Rose.Pink;
      } else if (amntSent >= ETH_RED_ROSE_PRICE) {
          roseType = Rose.Pink;
      } else {
          sender.transfer(amntSent);
          return;
      }

      // No double buying roses
      if (roseOwners[senderHash].hasRose) {
          sender.transfer(amntSent);
          return;
      }

      roseOwners[senderHash].hasRose = true;
      roseOwners[senderHash].roseType = roseType;
      roseOwners[senderHash].memo = memo;
  }

  uint constant GRLC_GOLD_ROSE_PRICE = 50;
  uint constant GRLC_WHITE_ROSE_PRICE = 10;
  uint constant GRLC_PINK_ROSE_PRICE = 4;
  uint constant GRLC_RED_ROSE_PRICE = 2;

  function buyRoseGRLC(bytes32 gaddr, string memo, uint amntSent) public {
      // Only a trusted oracle can call this function
      require(msg.sender == owner);

      Rose roseType;

      // Assign rose 
      if (amntSent >= GRLC_GOLD_ROSE_PRICE) {
          roseType = Rose.Gold;
      } else if (amntSent >= GRLC_WHITE_ROSE_PRICE) {
          roseType = Rose.White;
      } else if (amntSent >= GRLC_PINK_ROSE_PRICE) {
          roseType = Rose.Pink;
      } else if (amntSent >= GRLC_RED_ROSE_PRICE) {
          roseType = Rose.Pink;
      } else {          
          return;
      }

      // No double buying roses
      if (roseOwners[gaddr].hasRose) {          
          return;
      }

      roseOwners[gaddr].hasRose = true;
      roseOwners[gaddr].roseType = roseType;
      roseOwners[gaddr].memo = memo;
  }

  // No refunds fam soz not soz
}
