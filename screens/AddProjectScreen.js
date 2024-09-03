import { Alert, Button, Platform, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { saveProject } from "../services/ProjectService";

export default function ({ navigation }) {
    const { setUser } = useContext(AuthContext);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [errors, setErrors] = useState({});

    async function handleSave() {
        setErrors({});
        try {
            await saveProject({
                project_title: projectTitle,
                project_no: projectNo,
                project_area: projectArea,
                safety_type: safetyType,
                status: projectStatus  // Changed to match backend field name
            });

            
            navigation.navigate("Project");
        } catch (e) {
            if (e.response?.status == 422) {
                setErrors(e.response.data.errors);
                console.log(errors);
            }
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FormTextField
                    label="Project Title"
                    value={projectTitle}
                    onChangeText={(e) => setProjectTitle(e)}
                    errorMessage={errors.project_title}  // Match the backend field name
                />
                <FormTextField
                    label="Project No"
                    value={projectNo}
                    onChangeText={(e) => setProjectNo(e)}
                    errorMessage={errors.project_no}  // Match the backend field name
                />
                <FormTextField
                    label="Project Area"
                    value={projectArea}
                    onChangeText={(e) => setProjectArea(e)}
                    errorMessage={errors.project_area}  // Match the backend field name
                />
                <FormTextField
                    label="Safety Type"
                    value={safetyType}
                    onChangeText={(e) => setSafetyType(e)}
                    errorMessage={errors.safety_type}  // Match the backend field name
                />
                <FormTextField
                    label="Project Status"
                    value={projectStatus}
                    onChangeText={(e) => setProjectStatus(e)}
                    errorMessage={errors.status}  // Match the backend field name
                />
                <Button title="Save" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff",
        flex: 1
    },
    container: {
        padding: 20,
        rowGap: 16
    }
});
