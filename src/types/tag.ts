export interface Tag {
  id: string;
  name: string;
  color: string;
  background: string;
  createdAt: string;
}

export interface CreateTagDto {
  name: string;
  color: string;
  background: string;
}

export interface UpdateTagDto {
  name?: string;
  color?: string;
  background?: string;
}
