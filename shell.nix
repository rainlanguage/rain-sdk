let
 pkgs = import
    (builtins.fetchTarball {
      name = "nixos-unstable-2021-10-01";
      url = "https://github.com/nixos/nixpkgs/archive/0f33d439a715688605402a450fba0382b658d581.tar.gz";
      sha256 = "1nfz3z8dx5rbs6y6w35rrhbxb9sw70zkc5mr7g5k5rx3mqg5wp1x";
    })
    { };

 mnemonic = pkgs.writeShellScriptBin "mnemonic" ''
  mnemonics
 '';

 local-node = pkgs.writeShellScriptBin "local-node" ''
  cd balancer-local-dev && npx hardhat node
 '';

 local-fork = pkgs.writeShellScriptBin "local-fork" ''
 hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/G0Vg_iZFiAuUD6hjXqcVg-Nys-NGiTQy --fork-block-number 11833335
 '';

 local-test = pkgs.writeShellScriptBin "local-test" ''
 hardhat test --network localhost
 '';

 local-deploy = pkgs.writeShellScriptBin "local-deploy" ''
  cd balancer-local-dev && npx hardhat run --network localhost scripts/deploy-local.ts
 '';
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.nodejs-14_x
  mnemonic
  local-node
  local-deploy
  local-test
  local-fork
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
