# Fractionate v1.0

Fractionate is a real estate tokenization platform built on the Sepolia testnet of the Ethereum blockchain. It utilizes DAO (Decentralized Autonomous Organization) for governance. This project was developed by Chayapol Chaoveeraprasit as part of NUS FinTech Lab 2023 Summer Internship.

## Table of Contents

- [Installation](#installation)
- [Setting Up PostgreSQL Locally](#setting-up-postgresql-locally)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Installation

To set up Fractionate locally, follow these steps:

1. Clone the repository: `git clone https://github.com/chaycha/fractionate.git`
2. Install Node.js and Yarn:
   - Go to the <a href="https://nodejs.org/en/download/" target="_blank">downloads page</a> of the official Node.js website.
   - Choose the appropriate package for your operating system and architecture. The LTS version is recommended for most users.
   - Download the installer and run it. The installer will guide you through installing Node.js and npm.
   - After installing Node.js, verify the installation by opening a terminal and running `node -v` and `npm -v`.
   - Install Yarn using npm: `npm install -g yarn`.
   - Verify the Yarn installation by running `yarn -v`.
3. Install the dependencies in the `client`, `hardhat`, and `server` directories:

   - `cd client && yarn install`
   - `cd ../hardhat && yarn install`
   - `cd ../server && yarn install`

## Setting Up PostgreSQL Locally

Before setting up PostgreSQL, ensure that you have Node.js and Yarn installed on your machine as described in the [Installation](#installation) section.

1. Download and install PostgreSQL:

   - Visit the <a href="https://www.postgresql.org/download/" target="_blank">official PostgreSQL website</a> and download the version suitable for your operating system.
   - Run the installer and follow the instructions. Remember the password you set for the 'postgres' user during installation.

2. Verify the installation:

   - Open a terminal or command prompt.
   - Enter `psql -U postgres` command. It should ask for a password.
   - Enter the password you set during installation.
   - If everything is set up correctly, you should now be in the PostgreSQL command line. To exit, type `\q` and press `Enter`.

3. Set up the local database:

   - While in the PostgreSQL command line, create a new database using the `CREATE DATABASE fractionate;` command.
   - You can then connect to the new database using the `\c fractionate` command.

4. Import the schema:

   - After connected to the database, import the schema using the `\i path_to_db_schema.sql` command. Replace `path_to_db_schema.sql` with the path to the `db_schema.sql` file found in the `/server` subdirectory of this project.

5. Set the `DATABASE_URL` environment variable:

   - In your `.env` file, set `DATABASE_URL` to your local PostgreSQL connection string. It should look something like this: `postgresql://postgres:YourPassword@localhost:5432/fractionate`.

6. Now you should be able to run your application locally using the local PostgreSQL database by following the instructions in the [Running Locally](#running-locally) section.

Note 1: The current backend codebase connects directly to Vercel Postgres, even when developing. This is because the code for connection with Vercel Postgres and local PostgreSQL are quite different, and can't be set apart by environment variables. If you want to use local PostgreSQL for development, uncomment a sepcified section of code in `/server/routes/authRoutes.js`.
Note 2: The exact commands and connection string format can vary depending on your operating system and PostgreSQL configuration.

## Environment Variables

To run this project, you must set up environment variables in `.env` files:

1. In each of the three subdirectories (`/client`, `/hardhat`, `/server`), copy the `.env.sample` file to a new file named `.env` and replace the placeholders with your actual values.
2. Remember, never commit the `.env` file to the repository. It contains sensitive information and is included in the `.gitignore` file to prevent it from being accidentally committed.

Here are the environment variables required for each directory:

- `/client`

  - `REACT_APP_API_URL`: URL to the backend app
  - `REACT_APP_SEPOLIA_RPC_URL`: URL for RPC provider
    - Sign up for <a href="https://www.alchemyapi.io/" target="_blank">Alchemy</a>, and create an Alchemy project following point #1 of <a href="https://docs.alchemy.com/docs/alchemy-quickstart-guide" target="_blank">this guide</a>. Make sure to select "network" as "Sepolia".
    - Replace the value of `REACT_APP_SEPOLIA_RPC_URL` with your actual API key obtained from the Alchemy project.
  - `REACT_APP_TOKEN_CONTRACT_ADDRESS`, `REACT_APP_DAO_CONTRACT_ADDRESS`: Contract addresses on Sepolia for token and DAO contracts, respectively. Update these values every time the contracts are re-deployed.

- `/hardhat`

  - `HARDHAT_NETWORK`: Network name for the Hardhat network (local blockchain). Should be set to "localhost".
  - `SEPOLIA_RPC_URL`: URL for RPC provider, same as above.
  - `ADMIN_PRIVATE_KEY`: Private key of an account to act as Fractionate's admin (contracts deployer).
    - Install <a href="https://metamask.io" target="_blank">MetaMask</a> browser extension.
    - Create a new wallet on MetaMask.
    - Top up some SepoliaETH to the wallet using <a href="https://sepoliafaucet.com" target="_blank">Sepolia Faucet</a>.
    - Replace the value of `ADMIN_PRIVATE_KEY` with the actual private key of the newly created wallet.

- `/server`
  - `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`: Strings used by JWT to encrypt incoming data and return access and refresh tokens, respectively.
  - `CLIENT_URL`: URL to the frontend app (to allow CORS requests).
  - `DATABASE_URL`: URL specifying connection to local PostgreSQL database, as described in [Setting Up PostgreSQL Locally](#setting-up-postgresql-locally)
  - `POSTGRES_...`: Variables with the `POSTGRES` prefix are used by Vercel Postgres to access the database (only if you want to use Vercel Postgres for production. If not, ignore these variables).
    - Pull `.env.development.local` from your Vercel project using `vercel pull`.
    - Copy over all environment variables from `.env.development.local` to `/server/.env`.

## Running Locally

For local development and testing, follow these steps:

1. Start the backend Express.js server:
   - Open a terminal window, navigate to the server directory with `cd server`, and then start the server with `yarn start`.
   - This will start the backend server on port 4000.
2. Start the frontend development server:
   - Open a new terminal window, navigate to the client directory with `cd client`, and then start the development server with `yarn start`.
   - This will start the frontend server on port 3000.

You can now access the app at <a href="http://localhost:3000" target="_blank">localhost:3000</a>.

## Usage

To use Fractionate, follow these steps:

1. Navigate to the Fractionate platform in your web browser at <a href="https://fractionate-v1.vercel.app" target="_blank">fractionate-v1.vercel.app</a>.
2. Create a new wallet on MetaMask (or use your existing Ethereum wallet).
3. Sign up for Fractionate using your wallet's address.
4. Allow MetaMask to connect to the site.
5. Explore Fractionate's features. Try tokenizing a new asset under "Submit Asset", view all tokens you own under "My Assets", and transfer tokens to other wallets using "Transfer Tokens".
6. Please note our "one user, one wallet" policy: During your session, do not switch wallets or change to other networks (apart from Sepolia testnet) in MetaMask. Doing so will log you out immediately.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or concerns, please reach out to Chayapol Chaoveeraprasit at chayapol.com@gmail.com.
