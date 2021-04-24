export function convertDurationToTimeFormatted(
  durationInSeconds: number
): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  const result = [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");

  return result;
}
