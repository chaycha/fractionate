// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "hardhat/console.sol";

contract RealEstateTokens is ERC1155, AccessControl, ERC1155Supply {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _currentTokenId; // count how many tokens this contract has so far

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _currentTokenId = 0;
    }

    struct TokenData {
        string name;
        uint256 pricePerToken;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    mapping(uint256 => TokenData) private _tokenData;

    function mintNew(
        string memory name,
        uint256 amount,
        uint256 pricePerToken,
        address account
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, _currentTokenId, amount, "0x");
        _tokenData[_currentTokenId] = TokenData(name, pricePerToken);
        _currentTokenId++; // increase the counter
    }

    struct UserTokenData {
        uint256 id;
        string name;
        uint256 pricePerToken;
        uint256 balance;
    }

    function getTokenData(
        uint256 tokenId
    ) public view returns (TokenData memory) {
        return _tokenData[tokenId];
    }

    // write a function to accpet a user's address and return a dynamic array of all tokens that user has (non-zero)
    function getTokensOfUser(
        address account
    ) public view returns (UserTokenData[] memory) {
        UserTokenData[] memory tokens = new UserTokenData[](_currentTokenId);
        uint256 counter = 0;
        for (uint256 i = 0; i < _currentTokenId; i++) {
            if (balanceOf(account, i) > 0) {
                tokens[counter] = UserTokenData(
                    i,
                    _tokenData[i].name,
                    _tokenData[i].pricePerToken,
                    balanceOf(account, i)
                );
                counter++;
            }
        }
        // resize array remove unused elements
        assembly {
            mstore(tokens, counter)
        }
        return tokens;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
