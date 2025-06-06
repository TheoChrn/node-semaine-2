export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );

type WithIdParentId<TId = string> = {
  id: TId;
  parentId?: TId | null;
};

export function nestComments(comments: CommentBase[]): CommentWithChildren[] {
  const map = new Map<string, CommentWithChildren>();
  const roots: CommentWithChildren[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, children: [] });
  }

  for (const comment of comments) {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.children.push(map.get(comment.id)!);
      }
    } else {
      roots.push(map.get(comment.id)!);
    }
  }

  return roots;
}

export class NotFoundError extends Error {
  status: number;

  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}
