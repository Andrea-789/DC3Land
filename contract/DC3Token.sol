// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.6.0/token/ERC20/ERC20.sol";

contract DC3Token is ERC20 {
    constructor() ERC20("DC3Token", "DC3") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
