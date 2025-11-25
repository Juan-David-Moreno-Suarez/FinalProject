export interface User{
    id: any,
    email: string,
    username:string,
    full_name: string,
    age: number,
    avatar_url?:string,
    website?: string,
    bio?: string,
    is_private?: boolean,
    darkMode?: boolean,
    posts_url?: string[],
    posts_description?: string[]
}
export type updateProps = {
    id: any,
    username:string,
    full_name: string,
    avatar_url?:string,
    website?: string,
    bio?: string,
    is_private?: boolean,
    darkMode?: boolean,
    posts_url?: any[],
    posts_description?: any[]
}