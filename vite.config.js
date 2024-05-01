import glsl from "vite-plugin-glsl";

export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: {
        main: "src/index.html",
        un: "src/pages/projets/01.html",
        deux: "src/pages/projets/02.html",
        trois: "src/pages/projets/03.html",
        quatre: "src/pages/projets/04.html",
        cinq: "src/pages/projets/05.html",
        six: "src/pages/projets/06.html",
        sept: "src/pages/projets/07.html",
        huit: "src/pages/projets/08.html",
        neuf: "src/pages/projets/09.html",
      },
    },
  },
  plugins: [glsl()],
};
