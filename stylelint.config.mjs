/** @type {import("stylelint").Config} */
export default {
    extends: [
        "stylelint-config-standard",
        "stylelint-config-recess-order",
        "stylelint-config-html",
    ],
    plugins: ["stylelint-order"],
    rules: {
        "declaration-empty-line-before": null,
        "order/properties-order": [
            {
                emptyLineBefore: "always",
                properties: [
                    "position",
                    "top",
                    "right",
                    "bottom",
                    "left",
                    "z-index",
                    "display",
                    "flex",
                    "grid",
                ],
            },
            {
                emptyLineBefore: "always",
                properties: [
                    "margin",
                    "margin-top",
                    "margin-right",
                    "margin-bottom",
                    "margin-left",
                    "padding",
                    "padding-top",
                    "padding-right",
                    "padding-bottom",
                    "padding-left",
                ],
            },
            {
                emptyLineBefore: "always",
                properties: [
                    "width",
                    "min-width",
                    "max-width",
                    "height",
                    "min-height",
                    "max-height",
                ],
            },
            {
                emptyLineBefore: "always",
                properties: [
                    "font",
                    "font-family",
                    "font-size",
                    "font-weight",
                    "line-height",
                    "color",
                    "text-align",
                ],
            },
            {
                emptyLineBefore: "always",
                properties: [
                    "background",
                    "background-color",
                    "border",
                    "border-radius",
                    "box-shadow",
                ],
            },
        ],
    },
};
