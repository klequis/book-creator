import colors from "@colors/colors";

type LogColor = "green" | "blue" | "red" | "yellow" | "magenta";

export function log(
  color: LogColor,
  message?: string,
  ...optionalParams: any[]
): void {
  const timestamp = new Date().toISOString();
  switch (color) {
    case "green":
      console.log()
      console.log(colors.green(`[${timestamp}] ${message}`), ...optionalParams);
      console.log()
      break;
    case "blue":
      console.log()
      console.log(colors.blue(`[${timestamp}] ${message}`), ...optionalParams);
      console.log()
      break;
    case "red":
      console.log()
      console.log(colors.red(`[${timestamp}] ${message}`), ...optionalParams);
      console.log()
      break;
    case "yellow":
      console.log()
      console.log(
        colors.yellow(`[${timestamp}] ${message}`),
        ...optionalParams
      );
      console.log()
      break;
    case "magenta":
      console.log()
      console.log(
        colors.magenta(`[${timestamp}] ${message}`),
        ...optionalParams
      );
      console.log()
      break;
    default:
      console.log()
      console.log(`[${timestamp}] ${message}`, ...optionalParams);
      console.log()
      break;
  }
}
