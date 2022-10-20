import { resolve, parse } from "node:path";
import { readdir } from "node:fs";
import { EventInterface } from "../interfaces/EventInterface.js";
import { ClientInterface } from "../interfaces/ClientInterface.js";

export class EventLoader {
  public constructor(
    public client: ClientInterface,
    private eventsPath: string
  ) {}

  public async load() {
    this.client.logger.log("info", "Loading events");
    readdir(this.eventsPath, async (err, files) => {
      const filteredEventFiles = files.filter((e) => e.endsWith(".js"));

      if (!filteredEventFiles) throw new Error("No event files found!");

      this.client.logger.log(
        "info",
        `Found ${filteredEventFiles.length} event files`
      );

      for (const file of filteredEventFiles) {
        this.client.logger.log("info", `Reading ${file} file`);
        const filePath = resolve(this.eventsPath, file);

        const importedFile = await import(filePath);

        const eventClass = importedFile[parse(filePath).name];

        const eventClassObject = new eventClass() as EventInterface;

        this.client.on(eventClassObject.name as string, (...args) =>
          eventClassObject.execute(this.client, ...args)
        );
        this.client.logger.log("info", `Successfully imported ${file} event`);
      }
    });
  }
}
