import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export default function convesioExtensionLoader(): Plugin
{
    const VIRTUAL_MODULE_ID = "virtual:convesio-extensions";
    const RESOLVED_ID = "\0" + VIRTUAL_MODULE_ID;

    return {
        name: "convesio-extension-loader",
        resolveId(id: string)
        {
            if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
        },
        async load(id) {
            if (id !== RESOLVED_ID) return;

            // Read consumer's package.json
            const packagePath = resolve(process.cwd(), 'package.json');
            const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

            // Filter Convesio extensions
            const extensions: string[] = [];

            for (const dependencyName of Object.keys(dependencies))
            {
                try
                {
                    const dependencyPackagePath = require.resolve(`${dependencyName}/package.json`, { paths: [process.cwd()] });
                    const dependencyPackageJson = JSON.parse(readFileSync(dependencyPackagePath, 'utf-8'));

                    if (dependencyPackageJson.convesio?.type === 'checkout-extension')
                    {
                        extensions.push(dependencyName);
                    }
                }
                catch { /* Ignore */ }
            }

            // Emit a module that imports and exports them
            const imports = extensions.map((name, i) => `import extension${i} from ${JSON.stringify(name)};`).join('\n');
            const list = extensions.map((_, i) => `extension${i}`).join(', ');

            return `${imports}\nexport default [${list}];\n`;
        },
    };
}