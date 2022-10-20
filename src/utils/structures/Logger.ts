import { createLogger, format, transports, Logger } from "winston";

enum LoggingLevels {
  warn = "WARN",
  info = "INFO",
  error = "ERROR",
}

export class CustomLogger {
  private winston: Logger | null = null;
  constructor(private folderPath: string) {
    this.createLogger();
  }

  public terminateLogger() {
    this.winston?.end();
  }

  private createLogger() {
    this.winston = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.File({
          level: "info",
          filename: this.folderPath + "/info.log",
        }),
        new transports.File({
          level: "error",
          filename: this.folderPath + "/error.log",
        }),
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  public log(
    level: keyof typeof LoggingLevels,
    message: string,
    error?: Error
  ) {
    if (level === "error") {
      this.logError(error!);
      return;
    }

    this.winston![level](message);
  }

  private logError(error: Error) {
    this.winston?.error(`${error.message} \n stack: ${error.stack}`);
  }

  private test() {
    this.log("warn", "Warning::method embed.setColor is deprecated!");
    const error = new Error("HELLO");
    this.log("error", "", error);
    this.log("info", "Info::Kana joined a new server with 69 memebers!");
  }
}
