# WEBAPP
WebApp will be a cloud based application for CSYE6225 assignments to learn cloud. This is a basic node application with account and assignment models. Stack used: Node.js, Express.js, MySQL, Sequelize, Chai, Mocha.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: [Download and install Node.js](https://nodejs.org/)
- npm (Node Package Manager): Included with Node.js installation
- MySQL: [Download and install MySQL](https://dev.mysql.com/downloads/)

## Getting Started

### Installation

1. Clone the repository

2. Navigate to the project directory:

    ```bash
    cd webapp
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Database Setup

1. Create a MySQL database for your application.

2. Update the database configuration in `config/config.js` with your MySQL credentials.

### Environment Variables

Create a `.env` file in the root of your project with the following content:

```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name

Make sure to replace your_password and your_database_name with your MySQL password and database name.

Build
Run the following command to build the application:
npm run build

Start the application:
npm start

Test the application:
npm test