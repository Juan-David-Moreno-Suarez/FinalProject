import { supabase } from "@/utils/supabase";
import { createContext } from "react";
import { Alert } from "react-native";

interface DataContextProps {
    getData: () => Promise<any>
    getAllOrders: () => Promise<any>
    getOrder: () => Promise<any>
    createOrder: (items: any, table: number) => Promise<any>;
    unfollowUser: (followedId: string) => Promise<any>;
    getCategoryMenu: (category: string) => Promise<any>;
    getSpecial: () => Promise<any>
    getOrderMenu: (orderId: any) => Promise<any>

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

    const getOrder = async () => {
        const user = await getUser()
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('client_id', user.id)
            .neq('status', "Pagado")
            .limit(1)
            .single();

        if (error) throw error
        return data
    }

    const getAllOrders = async () => {

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('status', "En proceso")

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
    const getSpecial = async () => {
        const { data: special, error } = await supabase
            .from("menu")
            .select("*")
            .eq("category", "Especiales")

        if (error) throw error
        const randomIndex = Math.floor(Math.random() * 8 + 1);
        return special[randomIndex];
    }

    const createOrder = async (items: any, table: number) => {
        const { data } = await getData()
        const { data: orderData, error: orderError }: any = await supabase
            .from("orders")
            .insert([{ client_id: data?.id, status: "En proceso", table: table }])
            .select()

        if (orderError) return orderError;

        if (!orderData || orderData.length === 0) {
            console.error('No se pudo crear la orden');
            return 'No se pudo crear la orden';
        }

        const orderItems = items.map((item: any) => ({
            order_id: orderData[0].id,
            item_id: item.id,
            quantity: item.qty
        }))

        const { error: itemError } = await supabase
            .from("order_items")
            .insert(orderItems)
        if (itemError) return itemError
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

    const getOrderMenu = async (orderId: any) => {
        const { data: itemList, error: itemError } = await supabase
            .from("order_items")
            .select('item_id, quantity')
            .eq("order_id", orderId)

        if (itemError) return itemError

        if (!itemList || itemList.length === 0) {
            return []; // No hay items para ese order
        }

        const itemIds = itemList.map(item => item.item_id);

        const { data: menuItems, error: menuError } = await supabase
            .from("menu")
            .select('id, name, price')
            .in("id", itemIds)

        if (menuError) return menuError;

        const result = itemList.map(orderItem => {
            const menuItem = menuItems.find(menu => menu.id === orderItem.item_id);
            return {
                ...orderItem,
                name: menuItem?.name,
                price: menuItem?.price,
            };
        });

        return result;
    }

    return <DataContext.Provider
        value={{
            getData,
            getOrder,
            getAllOrders,
            createOrder,
            unfollowUser,
            getCategoryMenu,
            getSpecial,
            getOrderMenu

        }}
    >
        {children}
    </DataContext.Provider>

}

