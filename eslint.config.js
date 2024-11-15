import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
        rules: {
            "@typescript-eslint/strict-boolean-expressions": "error",
            "vue/multi-word-component-names": 0,
            "vue/html-button-has-type": [
                "error",
                {
                    button: true,
                    submit: true,
                    reset: true,
                },
            ],
            "vue/block-order": [
                "error",
                {
                    order: ["script", "template", "style"],
                },
            ],
        },
    },

    {
        name: "app/files-to-ignore",
        ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
    },

    ...pluginVue.configs["flat/essential"],
    ...vueTsEslintConfig(),
    skipFormatting,
];
