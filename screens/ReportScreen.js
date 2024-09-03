import { Button, SafeAreaView } from "react-native";
import { Text } from "react-native";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { logout } from "../services/AuthService";

export default function ({navigation}){

    const {user, setUser} = useContext(AuthContext);

    async function handleLogout(){
        await logout();
        setUser(null);
    }

    return (
        <SafeAreaView>
            <Text>Welcome , {user.name}</Text>
        
        </SafeAreaView>
    )
}