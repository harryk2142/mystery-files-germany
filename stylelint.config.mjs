/** @type {import("stylelint").Config} */
export default {
    extends: [
        "stylelint-config-standard",
        "stylelint-config-alphabetical-order",
        "stylelint-config-astro",
    ],
    plugins: ["@stylistic/stylelint-plugin"],
    rules: {
        "declaration-empty-line-before": null,
        "@stylistic/max-empty-lines": 1,
        "at-rule-empty-line-before": [
            "always",
            {
                except: [
                    "first-nested",
                    "after-same-name",
                    "inside-block",
                    "blockless-after-blockless",
                ],
                ignore: ["after-comment"],
            },
        ],
        "rule-empty-line-before": [
            "always",
            {
                except: ["first-nested", "inside-block-and-after-rule"],
                ignore: ["after-comment", "inside-block"],
            },
        ],
    },
};
