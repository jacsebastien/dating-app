import { User } from "./user.model";

export interface AuthUser {
    tokenString: string;
    user?: User;
}
