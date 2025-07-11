export interface UserType {
  _id: string;
  userId: number;
  name: string;
  email: string;
  role: "admin" | "user";
  registeredEvents: string[];
}
