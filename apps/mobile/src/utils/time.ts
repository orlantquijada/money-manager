const SECOND = 1000;
const MINUTE = 60 * SECOND;

type AsMillisecondsParams = {
  seconds?: number;
  minutes?: number;
};

export function asMilliseconds({
  seconds = 0,
  minutes = 0,
}: AsMillisecondsParams) {
  return seconds * SECOND + minutes * MINUTE;
}
