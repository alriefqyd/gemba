import { Alert, TouchableOpacity, Platform, SafeAreaView, StyleSheet, View, Text, Image, ActivityIndicator, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext, useLayoutEffect, navigation } from "react";
import { login, loadUser } from "../services/AuthService";
import AuthContext from "../context/AuthContext";

const { width, height } = Dimensions.get("window");


export default function ({ navigation }) {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    async function handleLogin() {
        setErrors({});
        setLoading(true);

        try {
            await login({
                email,
                password,
                device_name: `${Platform.OS} ${Platform.Version}`,
            });

            const user = await loadUser();
            setUser(user);
        } catch (e) {
            if (e.response?.status === 422) {
                setErrors(e.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <Image source={require("../assets/pngegg.png")} style={styles.logo} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>SIGEMOY</Text>
                    <Text style={styles.subtitle}>Sistem Informasi Gemba Online Yes</Text>
                </View>
                <FormTextField
                    label="Email"
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                    errorMessage={errors.email}
                />
                <FormTextField
                    label="Password"
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                    secureTextEntry={true}
                    errorMessage={errors.password}
                />
                <TouchableOpacity onPress={() => Alert.alert("Forgot Password?")} style={styles.linkContainer}>
                    <Text style={styles.linkText}>Forgot password?</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
                ) : (
                    <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Log in</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate("Create account")} style={styles.signupContainer}>
                    <Text style={styles.signupText}>New user? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#f8f9fa",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: width * 0.85, // Responsive width
        maxWidth: 400,
        padding: width > 400 ? 24 : 16, // Adjust padding based on screen width
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    logo: {
        width: width * 0.25, // Adjust logo width based on screen size
        height: height * 0.08,
        alignSelf: "center",
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: width > 400 ? 24 : 20, // Adjust title font size for smaller screens
        fontWeight: "600",
        color: "#343a40",
    },
    subtitle: {
        fontSize: width > 400 ? 16 : 14,
        color: "#6c757d",
        marginTop: 4,
        textAlign: "center",
    },
    linkContainer: {
        alignItems: "flex-end",
        marginTop: 8,
    },
    linkText: {
        color: "#007bff",
        fontSize: width > 400 ? 14 : 12,
    },
    loginButton: {
        backgroundColor: "#007bff",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 24,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: width > 400 ? 16 : 14,
        fontWeight: "600",
    },
    loadingIndicator: {
        marginTop: 24,
    },
    signupContainer: {
        alignItems: "center",
        marginTop: 16,
    },
    signupText: {
        color: "#007bff",
        fontSize: width > 400 ? 14 : 12,
    },
});
