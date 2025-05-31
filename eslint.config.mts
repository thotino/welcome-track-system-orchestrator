import path from "node:path";
import tseslint from "typescript-eslint";

export default tseslint.config(
    tseslint.configs.recommendedTypeChecked,
    {languageOptions: {parserOptions: {projectService: true, tsconfigRootDir: path.join(import.meta.dirname, "tsconfig.json")}}},
);
