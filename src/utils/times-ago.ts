export const timesAgo = (date: Date): string => {
  const now = new Date();
  const delta = now.getTime() - date.getTime();

  if (delta < 60000) {
    return "just now";
  } else if (delta < 3600000) {
    const minutes = Math.floor(delta / 60000);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (delta < 86400000) {
    const hours = Math.floor(delta / 3600000);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(delta / 86400000);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};
