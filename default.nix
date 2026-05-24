let
  pins = import ./npins {};
  pkgs = import pins.nixpkgs {};
in
  pkgs.callPackage ./package.nix {}
