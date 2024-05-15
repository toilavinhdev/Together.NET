export interface ICreatePostRequest {
  content: string;
}

export interface ICreatePostResponse {
  id: string;
  content: string;
  createdById: string;
  createdAt: string;
}

export interface ICreateReplyRequest {
  postId: string;
  parentId?: string;
  content: string;
}

export interface ICreateReplyResponse {
  id: string;
  postId: string;
  parentId?: string;
  content: string;
}
