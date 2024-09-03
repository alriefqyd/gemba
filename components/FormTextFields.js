import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "react-native";

function FormTextField({label, errorMessage = [], ...rest}){
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.textInput} autoCapitalize="none" {...rest}/>
            {errorMessage.map((err) => {
                return (
                    <Text key={err} style={styles.error}>
                        {err}
                    </Text>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    label:{
        color:"#334155",
        fontWeight:'500'
    },
    textInput : {
        backgroundColor:"#f1f5f9",
        height:40,
        marginTop:4,
        borderWidth:1,
        borderRadius:4,
        borderColor:"#cbd5e1",
        padding:10
    },
    error : {
        color:"red",
        marginTop:2
    }
})

export default FormTextField;
