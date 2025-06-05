export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );

export class NotFoundError extends Error {
  status: number;

  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}
