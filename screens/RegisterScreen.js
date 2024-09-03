import { Alert, Button, Platform, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext } from "react";
import  {login, loadUser, register} from "../services/AuthService";
import AuthContext from "../context/AuthContext";


export default function ({navigation}){
    const {setUser} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});

    async function handleRegister({navigation}){
        setErrors({});
        try {
        
            await register({
                name,
                email,
                password,
                password_confirmation:passwordConfirmation,
                device_name:`${Platform.OS} ${Platform.Version}`
            })

            const user = await loadUser();
            setUser(user)
            navigation.replace("Home")
        } catch (e) {
            if(e.response?.status == 422){
                setErrors(e.response.data.errors);
            }
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FormTextField label="Name" value={name} onChangeText={(e) => setName(e)} errorMessage={errors.name}/>
                <FormTextField label="Email" value={email} onChangeText={(e) => setEmail(e)} errorMessage={errors.email}/>
                <FormTextField label="Password" value={password} onChangeText={(e) => setPassword(e)} secureTextEntry={true} errorMessage={errors.password}/>
                <FormTextField label="Password Confirmation" value={passwordConfirmation} onChangeText={(e) => setPasswordConfirmation(e)} secureTextEntry={true} errorMessage={errors.password_confirmation}/>
                <Button title="Register" onPress={handleRegister}/>
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

