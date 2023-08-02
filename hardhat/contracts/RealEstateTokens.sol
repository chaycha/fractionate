// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract RealEstateTokens is ERC1155, ERC1155Supply {
    uint256 private _currentTokenId; // count how many tokens this contract has so far

    // Mapping from token ID to token data
    mapping(uint256 => TokenData) private _tokenData;
    // Mapping from token ID to an array of addresses of token holders
    mapping(uint256 => address[]) public tokenHolders;

    // Mapping from token ID and address to a boolean (to check if an address is a token holder)
    mapping(uint256 => mapping(address => bool)) public isTokenHolder;

    struct TokenData {
        string name;
        uint256 pricePerToken;
    }

    constructor() ERC1155("") {
        _currentTokenId = 0;
    }

    // Function to get number of token holders based on token id
    function getTokenHoldersLength(
        uint256 tokenId
    ) public view returns (uint256) {
        return tokenHolders[tokenId].length;
    }

    // Override _beforeTokenTransfer function to update the tokenHolders mapping
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];

            // If the sender's balance will be zero after this transfer, remove them from the token holders
            if (from != address(0) && balanceOf(from, id) == amounts[i]) {
                _removeTokenHolder(id, from);
            }

            // If the receiver's balance will be non-zero after this transfer, add them to the token holders
            if (balanceOf(to, id) + amounts[i] > 0 && !isTokenHolder[id][to]) {
                _addTokenHolder(id, to);
            }
        }
    }

    function _addTokenHolder(uint256 tokenId, address account) private {
        tokenHolders[tokenId].push(account);
        isTokenHolder[tokenId][account] = true;
    }

    function _removeTokenHolder(uint256 tokenId, address account) private {
        address[] storage holders = tokenHolders[tokenId];
        for (uint256 i = 0; i < holders.length; ++i) {
            if (holders[i] == account) {
                // Swap the holder to remove with the last holder in the array
                holders[i] = holders[holders.length - 1];
                // Remove the last holder in the array
                holders.pop();
                break;
            }
        }
        isTokenHolder[tokenId][account] = false;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        _mintBatch(to, ids, amounts, data);
    }

    function mintNew(
        string memory name,
        uint256 amount,
        uint256 pricePerToken,
        address account
    ) public {
        _mint(account, _currentTokenId, amount, "0x");
        _tokenData[_currentTokenId] = TokenData(name, pricePerToken);
        _currentTokenId++;
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

    // Return array of UserTokenData for all tokens with non-zero balance owned by that user
    function getTokensOfUser(
        address account
    ) public view returns (UserTokenData[] memory) {
        // First, count the number of tokens the user has
        uint256 count = 0;
        for (uint256 i = 0; i < _currentTokenId; i++) {
            if (balanceOf(account, i) > 0) {
                count++;
            }
        }

        // Create a new array with the correct size
        UserTokenData[] memory tokens = new UserTokenData[](count);

        // Populate the array with the user's tokens
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

        return tokens;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
