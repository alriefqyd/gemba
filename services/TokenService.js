import * as secureStore from "expo-secure-store";

let token = null;

export async function setToken(newToken){
    token = newToken;
    if(token !== null){
        await secureStore.setItemAsync("token", token);
    } else {
        await secureStore.deleteItemAsync("token");
    }
}

export async function getToken(){
    if(token !== null){
        return token
    }

    token = await secureStore.getItemAsync("token")

    return token;
}