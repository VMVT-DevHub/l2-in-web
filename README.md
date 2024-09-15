# L2 eksporto prašymų WEB

[![License](https://img.shields.io/github/license/vmvt-devhub/l2-in-web)](https://github.com/vmvt-devhub/l2-in-web/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/vmvt-devhub/l2-in-web)](https://github.com/vmvt-devhub/l2-in-web/issues)
[![GitHub stars](https://img.shields.io/github/stars/vmvt-devhub/l2-in-web)](https://github.com/vmvt-devhub/l2-in-web/stargazers)

This repository contains the source code and documentation for the VMVT eksporto prašymai, developed by the Valstybinė maisto ir veterinarijos tarnyba

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The L2 IN WEB is designed to provide functionalities of collecting data for certificates

This is a client application that utilizes
the [L2 in API](https://github.com/vmvt-devhub/l2-in-api).

## Getting Started

To get started with the L2 IN WEB, follow the instructions below.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vmvt-devhub/l2-in-web.git
   ```

2. Install the required dependencies:

   ```bash
   cd l2-in-web
   yarn install
   ```

### Usage

1. Set up the required environment variables. Copy the `.env.example` file to `.env` and provide the necessary values for the variables.

2. Start the WEB server:

   ```bash
   yarn start
   ```

The WEB will be available at `http://localhost:8080`.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request. For more information, see the [contribution guidelines](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
