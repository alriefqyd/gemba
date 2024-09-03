import { Alert, Button, Platform, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext } from "react";
import  {login, loadUser} from "../services/AuthService";
import AuthContext from "../context/AuthContext";


export default function ({navigation}){
    const {setUser} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    async function handleLogin(){
        setErrors({});
        try {
        
            await login({
                email,
                password,
                device_name:`${Platform.OS} ${Platform.Version}`
            })

            const user = await loadUser();
            setUser(user)

        } catch (e) {
            if(e.response?.status == 422){
                setErrors(e.response.data.errors);
            }
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FormTextField label="Email" value={email} onChangeText={(e) => setEmail(e)} errorMessage={errors.email}/>
                <FormTextField label="Password" value={password} onChangeText={(e) => setPassword(e)} secureTextEntry={true} errorMessage={errors.password}/>
                <Button title="Login" onPress={handleLogin}/>
                <Button title="Create account" onPress={() => navigation.navigate("Create account")}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper : {
        backgroundColor:"#fff", flex:1
    },
    container:{
        padding:20, rowGap:16
    }
})

