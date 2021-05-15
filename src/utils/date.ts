export const addMinutes = (date: Date, minutes: number): Date => {
  const time = new Date().setMinutes(date.getMinutes() + minutes);
  return new Date(time);
};
