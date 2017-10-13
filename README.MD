# ind-modal

Lightweight library for opening modal dialogs/panels in Angular applications.

## Demo
![Demo](/images/demo.gif)

## Installation

To install this library, run:

```bash
$ npm install ind-modal --save
```

## Usage

See the example Angular application in the **playground** folder. 

In order to run the example application you need to first build the library  and link it to **node_modules** in the **playground** folder. Please follow the follosing steps:

```bash
# 1. Install dependencies
yarn install

# 2. Build the library
npm run build

# 3. Create an NPM link
npm link

# 4. Go to the "plaground" folder
cd plaground

# 5. Install dependencies
yarn install

# 6. Run the example application
yarn start
```

Now you can navigate to `http://localhost:4200` to use the **playground**.

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Independer.nl](https://werkenbij.independer.nl/)
