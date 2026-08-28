{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = inputs: {
    packages = builtins.mapAttrs (system: pkgs: {
      default = pkgs.buildNpmPackage {
        pname = "blog9";
        version = "1.0.0";
        src = ./.;
        npmDepsHash = "sha256-9ZOGeI+nLfL85cFv5/50sKDa2oCEyv47d5QSQqhmeQo=";
        meta = {
          description = "My personal website & blog";
          homepage = "https://australorp.dev";
        };
        installPhase = ''
          runHook preInstall

          mkdir -p $out/share/
          cp -r dist/ $out/share/

          runHook postInstall
        '';
      };
    }) inputs.nixpkgs.legacyPackages;
  };
}
