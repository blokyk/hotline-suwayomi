{
  lib,
  stdenvNoCC,
  zip,
}:
let
  manifest = builtins.fromJSON (builtins.readFile ./manifest.json);

  accessedUrls = builtins.filter (x: x != null) (
    map
      (content: content.matches or null)
      manifest.content_scripts
  );
in
stdenvNoCC.mkDerivation (prev: {
  pname = "hotline-suwayomi";
  version = manifest.version;

  src = lib.cleanSource ./.;

  nativeBuildInputs = [ zip ];

  installPhase = ''
    dst="$out/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}"
    mkdir -p "$dst"
    zip --recurse-paths "$dst/${prev.passthru.addonId}.xpi" .
  '';

  passthru.addonId = manifest.browser_specific_settings.gecko.id;

  meta = {
    description = manifest.description;
    homepage = manifest.homepage_url;
    license = lib.licenses.gpl3Plus;
    mozPermissions = accessedUrls ++ manifest.permissions;
    platforms = lib.platforms.all;
  };
})