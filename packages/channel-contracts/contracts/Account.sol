pragma solidity >0.4.99 <0.6.0;

import "./SafeMath.sol";

contract Account {
    using SafeMath for uint256;

    constructor() public {
      uint256 gas = gasleft();
      uint256 refund = gas.mul(tx.gasprice);
      //msg.sender.transfer(refund);
    }
}
