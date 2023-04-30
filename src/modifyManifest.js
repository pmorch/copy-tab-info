import manifest from `./manifest.json` assert { type: "json" };
import packageJSON from `../package.json` assert { type: "json" };

export default function makeManifest() {
    return {
        name: "modify-manifest",
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'manifest.json',
                source: JSON.stringify({
                    ...manifest,
                    version: packageJSON.version
                }, null, 2) + "\n"
            });
        }
    };
}
