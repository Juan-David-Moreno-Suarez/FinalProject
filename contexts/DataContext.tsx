import { updateProps, User } from "@/types/common.type";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { createContext } from "react";
import { Alert } from "react-native";

interface DataContextProps {
    getData: () => Promise<any>
    getAllUsers: () => Promise<User[]>
    getOtherUser: (username: any) => Promise<User>
    updateProfile: (newData: any) => Promise<any>
    followUser: (followedId: string) => Promise<any>;
    unfollowUser: (followedId: string) => Promise<any>;
    getCategoryMenu: (category: string) => Promise<any>;
    getSpecial: () => Promise<any>

}

export const DataContext = createContext({} as DataContextProps);
export const DataProvider = ({ children }: any) => {

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) throw new Error('No autenticado')
        return data.user
    };

    const getData = async () => {
        const user = await getUser()

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        return { data, user }
    };

    const getOtherUser = async (username: any) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single()

        if (error) throw error
        return data
    }

    const getAllUsers = async () => {

        const user = await getUser()

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', user.id)

        if (error) throw error;

        return data
    }

    const getCategoryMenu = async (category: string) => {
        if (category == "Todos") {
            const { data: menuItems, error } = await supabase
                .from("menu")
                .select("*");
            if (error) throw error
            return menuItems;
        }
        const { data: menuItems, error } = await supabase
            .from("menu")
            .select("*")
            .eq("category", category)
        if (error) throw error

        return menuItems
    }
    const getSpecial = async() => {
        const { data: special, error } = await supabase
                .from("menu")
                .select("*")
                .eq("category", "Especiales")
                
            if (error) throw error
            const randomIndex = Math.floor(Math.random() * 8 + 1);
            return special[randomIndex];
    }

    const followUser = async (followedId: string) => {
        const { data } = await getData()
        const { error } = await supabase
            .from("users_interactions")
            .insert([{ follower_id: data?.id, followed_id: followedId }])

        if (error) return error;
        return null;
    }

    const unfollowUser = async (followedId: string) => {
        const { data } = await getData()
        const { error } = await supabase
            .from("users_interactions")
            .delete()
            .eq("follower_id", data?.id)
            .eq("followed_id", followedId);
        if (error) return error;
        return null;
    }

    const updateProfile = async (newData: any) => {

        const { data } = await getData()
        const { error: uploadError } = await supabase
            .from('profiles')
            .update(newData)
            .eq('id', data.id)

        if (uploadError) {
            if (uploadError?.message.includes("duplicate")) {
                Alert.alert("Error", "Username already exists")

            }
            else {
                Alert.alert("Error", uploadError.message)
            }
            return uploadError
        }
        return null

    }
    const likePost = async (url: any) => {
        const { data } = await getData()
        const { error } = await supabase
            .from('likes')
            .insert([{
                url: url,
                liked_by: data?.id
            }]);
        if (error) throw error
    }

    const unlikePost = async (url: any) => {
        const { data } = await getData()
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('url', url)
            .eq('liked_by', data?.id);

        if (error) throw error

    }

    const getLikes = async (url: any) => {

        const { data: likesId, error } = await supabase
            .from('likes')
            .select('liked_by')
            .eq('url', url)
        if (error) throw error
        return likesId.map(item => item.liked_by)
    }

    return <DataContext.Provider
        value={{
            getData,
            getOtherUser,
            getAllUsers,
            updateProfile,
            followUser,
            unfollowUser,
            getCategoryMenu,
            getSpecial

        }}
    >
        {children}
    </DataContext.Provider>

}

