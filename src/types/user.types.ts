import { UserRole } from "@/lib/axios/authUtils";

export interface UserInfo {
    id : string;
    name : string,
    email : string,
    role : UserRole
} 