export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: UserRole;
}
