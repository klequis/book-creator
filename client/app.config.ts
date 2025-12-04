import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        { find: "~", replacement: new URL("./src", import.meta.url).pathname }
      ]
    }
  }
});
