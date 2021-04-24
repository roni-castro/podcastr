export function convertDurationToTimeFormatted(
  durationInSeconds: number
): string {
  function padWithZero(
    value: number,
    numberOfDigits: number = 2,
    replaceStr: string = "0"
  ) {
    return value.toString().padStart(numberOfDigits, replaceStr);
  }

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  return `${hours}:${padWithZero(minutes)}:${padWithZero(seconds)}`;
}
