# Rain Protocol SDK

An in-progress SDK for interacting with Rain Protocol's factories and their child contracts.

This SDK uses an [ethers.js](https://docs.ethers.io/v5/) interface.

## Development setup (for contributors)

### Nix shell

Install the nix shell if you haven't already.

```bash
curl -L https://nixos.org/nix/install | sh
```

Drop into a nix-shell.

```bash
nix-shell
```

The shell hook will:

1. `yarn install`
2. Compile the @beehive-innovation/rain-protocol and @beehive-innovation/statusfi dependencies
3. Copy the compiled typechain files into src/typechain.

### Commands

This library uses TSDX to compile and bundle. To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `yarn build`.

To run tests, use `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the library size with `yarn size` and visualize the bundle with `yarn analyze`.
