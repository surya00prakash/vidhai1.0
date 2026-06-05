// hero.ts
import { heroui } from "@heroui/react";
export default heroui(
    {
        "themes": {
            "light": {
                "colors": {
                    "primary": {
                        "50": "#dff5f7",
                        "100": "#b3e6ec",
                        "200": "#86d7e1",
                        "300": "#59c8d6",
                        "400": "#2dbacb",
                        "500": "#00abc0",
                        "600": "#008d9e",
                        "700": "#006f7d",
                        "800": "#00515b",
                        "900": "#00333a",
                        "foreground": "#000",
                        "DEFAULT": "#00abc0"
                    },
                    "secondary": {
                        "50": "#e2e4e8",
                        "100": "#b8bec7",
                        "200": "#8f98a6",
                        "300": "#667285",
                        "400": "#3c4c65",
                        "500": "#132644",
                        "600": "#101f38",
                        "700": "#0c192c",
                        "800": "#091220",
                        "900": "#060b14",
                        "foreground": "#fff",
                        "DEFAULT": "#132644"
                    },
                    "success": {
                        "50": "#e2f8ec",
                        "100": "#b9efd1",
                        "200": "#91e5b5",
                        "300": "#68dc9a",
                        "400": "#40d27f",
                        "500": "#17c964",
                        "600": "#13a653",
                        "700": "#0f8341",
                        "800": "#0b5f30",
                        "900": "#073c1e",
                        "foreground": "#000",
                        "DEFAULT": "#17c964"
                    },
                    "warning": {
                        "50": "#fef4e4",
                        "100": "#fce4bd",
                        "200": "#fad497",
                        "300": "#f9c571",
                        "400": "#f7b54a",
                        "500": "#f5a524",
                        "600": "#ca881e",
                        "700": "#9f6b17",
                        "800": "#744e11",
                        "900": "#4a320b",
                        "foreground": "#000",
                        "DEFAULT": "#f5a524"
                    },
                    "danger": {
                        "50": "#fff1f1",
                        "100": "#ffd7d7",
                        "200": "#ffb3b3",
                        "300": "#ff8080",
                        "400": "#ff4d4d",
                        "500": "#e11d1d",
                        "600": "#c41a1a",
                        "700": "#991414",
                        "800": "#6e0f0f",
                        "900": "#430909",
                        "foreground": "#fff",
                        "DEFAULT": "#e11d1d"
                    },
                    "background": "#ffffff",
                    "foreground": "#000000",
                    "content1": {
                        "DEFAULT": "#ffffff",
                        "foreground": "#000"
                    },
                    "content2": {
                        "DEFAULT": "#f4f4f5",
                        "foreground": "#000"
                    },
                    "content3": {
                        "DEFAULT": "#e4e4e7",
                        "foreground": "#000"
                    },
                    "content4": {
                        "DEFAULT": "#d4d4d8",
                        "foreground": "#000"
                    },
                    "focus": "#006FEE",
                    "overlay": "#000000"
                }
            },
            "dark": {
                "colors": {
                    "default": {
                        "50": "#0d0d0e",
                        "100": "#19191c",
                        "200": "#26262a",
                        "300": "#323238",
                        "400": "#3f3f46",
                        "500": "#65656b",
                        "600": "#8c8c90",
                        "700": "#b2b2b5",
                        "800": "#d9d9da",
                        "900": "#ffffff",
                        "foreground": "#fff",
                        "DEFAULT": "#3f3f46"
                    },
                    "primary": {
                        "50": "#00333a",
                        "100": "#00515b",
                        "200": "#006f7d",
                        "300": "#008d9e",
                        "400": "#00abc0",
                        "500": "#2dbacb",
                        "600": "#59c8d6",
                        "700": "#86d7e1",
                        "800": "#b3e6ec",
                        "900": "#dff5f7",
                        "foreground": "#000",
                        "DEFAULT": "#00abc0"
                    },
                    "secondary": {
                        "50": "#060b14",
                        "100": "#091220",
                        "200": "#0c192c",
                        "300": "#101f38",
                        "400": "#132644",
                        "500": "#3c4c65",
                        "600": "#667285",
                        "700": "#8f98a6",
                        "800": "#b8bec7",
                        "900": "#e2e4e8",
                        "foreground": "#fff",
                        "DEFAULT": "#132644"
                    },
                    "success": {
                        "50": "#073c1e",
                        "100": "#0b5f30",
                        "200": "#0f8341",
                        "300": "#13a653",
                        "400": "#17c964",
                        "500": "#40d27f",
                        "600": "#68dc9a",
                        "700": "#91e5b5",
                        "800": "#b9efd1",
                        "900": "#e2f8ec",
                        "foreground": "#000",
                        "DEFAULT": "#17c964"
                    },
                    "warning": {
                        "50": "#4a320b",
                        "100": "#744e11",
                        "200": "#9f6b17",
                        "300": "#ca881e",
                        "400": "#f5a524",
                        "500": "#f7b54a",
                        "600": "#f9c571",
                        "700": "#fad497",
                        "800": "#fce4bd",
                        "900": "#fef4e4",
                        "foreground": "#000",
                        "DEFAULT": "#f5a524"
                    },
                    "danger": {
                        "50": "#430909",
                        "100": "#6e0f0f",
                        "200": "#991414",
                        "300": "#c41a1a",
                        "400": "#e11d1d",
                        "500": "#ff4d4d",
                        "600": "#ff8080",
                        "700": "#ffb3b3",
                        "800": "#ffd7d7",
                        "900": "#fff1f1",
                        "foreground": "#fff",
                        "DEFAULT": "#e11d1d"
                    },
                    "background": "#000000",
                    "foreground": "#ffffff",
                    "content1": {
                        "DEFAULT": "#18181b",
                        "foreground": "#fff"
                    },
                    "content2": {
                        "DEFAULT": "#27272a",
                        "foreground": "#fff"
                    },
                    "content3": {
                        "DEFAULT": "#3f3f46",
                        "foreground": "#fff"
                    },
                    "content4": {
                        "DEFAULT": "#52525b",
                        "foreground": "#fff"
                    },
                    "focus": "#006FEE",
                    "overlay": "#ffffff"
                }
            }
        },
        "layout": {
            "disabledOpacity": "0.5"
        }
    }
);