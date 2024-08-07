# JamSesh

**JamSesh** is a social media application designed for music enthusiasts to share and discover music content. Users can create posts, follow other users, and edit their profiles.

## Prerequisites

Make sure you have the following installed:
- [Node.js v20](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started

To run this project, follow these steps:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/<yourusername>/jamsesh.git
    cd jamsesh
    ```

2. **Set Node options:**

    Paste this command into your terminal to avoid legacy errors:

    ```sh
    export NODE_OPTIONS=--openssl-legacy-provider
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

4. **Start the server:**

    Open a terminal and navigate to the server directory, then start the server:

    ```sh
    cd server/
    npm start
    ```

5. **Start the client:**

    Open another terminal, navigate to the client directory, and start the client:

    ```sh
    cd client/
    npm start
    ```

## Usage

Once both the server and client are running, you can access the app in your browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss any changes.
