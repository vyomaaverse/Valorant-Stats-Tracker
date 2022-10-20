import { Kana } from "./utils/structures/Kana.js";

const kana = new Kana();
kana.start();

process.on("SIGTERM", async () => {
  kana.logger.log("info", `Terminating process`);
  kana.logger.terminateLogger();
});
