// @ts-nocheck

export function toDate(timestamp) {
  let millis = (timestamp?.seconds.toNumber() || 0) * 1000;
  millis += (timestamp?.nanos || 0) / 1000000;
  return new Date(millis);
}

export function toTimestamp(isoDateString) {
  const d = new Date(isoDateString);
  const millis = d.getTime();
  return {
    seconds: millis / 1000,
    nanos: (millis % 1000) * 1000000,
  };
}
