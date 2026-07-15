export interface User {
    id: string;

    name: string;

    avatarUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUser {
    name: string;

    avatarUrl?: string;
}

export interface UpdateUser {
    name?: string;

    avatarUrl?: string;
}