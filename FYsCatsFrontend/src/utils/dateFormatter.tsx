import { formatDistanceToNow } from "date-fns";

export const dateFormatter = (date: Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
