# OSRD-NGE

This proof of concept demonstrates the ability to produce a build of NGE with additional code.
This build logs `OSRD-NGE proof of concept` in the developer console.


## Initial setup

Initialize the project in the `osrd-nge-poc` directory:

```sh
git clone git@github.com:osrd-project/osrd-nge-poc
git -C osrd-nge-poc clone git@github.com:SchweizerischeBundesbahnen/netzgrafik-editor-frontend
patch -d osrd-nge-poc/netzgrafik-editor-frontend/ < osrd-nge-poc/0001-dist-files.patch
```

## Build instructions

In the `osrd-nge-poc` directory:

```sh
npm install
npm run build
```

The resulting build can be found in `dist`.
