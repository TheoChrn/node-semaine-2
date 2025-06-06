export {};

declare global {
  type Features = Record<
    "planned" | "ongoing" | "done",
    {
      votes: {
        upCount: number;
        downCount: number;
      };
      commentCount: number;
      id: string;
      description: string;
      title: string;
      status: "planned" | "ongoing" | "done";
      createdBy: string;
    }[]
  >;

  interface CommentBase {
    id: string;
    authorId: string;
    createdAt: Date;
    content: string;
    parentId: string | null;
    user: {
      email: string;
    };
    parent: {
      id: string;
      createdAt: Date;
      content: string;
      authorId: string;
      user: {
        email: string;
      };
    } | null;
  }

  interface CommentWithChildren extends CommentBase {
    children: CommentWithChildren[];
  }

  type Comments = CommentWithChildren[] | null;

  type Feature = {
    votes: {
      users: string[];
      userValue: "up" | "down" | undefined;
      upCount: number;
      downCount: number;
    };
    comments: Comments;
    description?: string | undefined;
    title?: string | undefined;
    createdBy?: string | undefined;
  };
}
