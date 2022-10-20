export class Utils {
  convertToPascalCase(word: string) {
    return word[0].toUpperCase() + word.slice(1, word.length);
  }

  resolveApexStatsLink(platform: string, id: string) {
    return `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${id}`;
  }

  timeoutRequest(): Promise<string> {
    return new Promise((res, rej) =>
      setTimeout(() => {
        res("Error :- Timeout");
      }, 10000)
    );
  }
}
