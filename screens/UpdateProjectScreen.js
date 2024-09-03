import { Alert, Button, SafeAreaView, StyleSheet, View } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { getProjectDetail, saveProject, updateProject } from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";

export default function ({ route, navigation }) {
    const { setUser } = useContext(AuthContext);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [project, setProject] = useState({});

    const {fetchProjects,currentProject, setCurrentProject} = useContext(ProjectContext)

    const { id } = route.params;

    useEffect(() => {
        if (id) {
            fetchProjectDetail(id);
        }
    }, [id]);

    const fetchProjectDetail = async (id) => {
        try {
            const data = await getProjectDetail(id);
            setProject(data.data);
            setProjectTitle(data.data.project_title);
            setProjectNo(data.data.project_no);
            setProjectArea(data.data.project_area);
            setSafetyType(data.data.safety_type);
            setProjectStatus(data.data.status);
        } catch (error) {
            console.error("Failed to fetch project detail:", error);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                project_title: projectTitle,
                project_no: projectNo,
                project_area: projectArea,
                safety_type: safetyType,
                status: projectStatus,
            };
            const response = await updateProject(id, payload); // Pass id if it's an update, or remove id if it's a new project
            Alert.alert("Success", "Project saved successfully");
            // setCurrentProject(payload)
            navigation.navigate("Detail Project", {id:id}); // Navigate back after saving
            // fetchProjects();
        } catch (error) {
            console.error("Failed to save project:", error);
            setErrors(error.response.data.errors || {});
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FormTextField
                    label="Project Title"
                    value={projectTitle}
                    onChangeText={(e) => setProjectTitle(e)}
                    errorMessage={errors.project_title}
                />
                <FormTextField
                    label="Project No"
                    value={projectNo}
                    onChangeText={(e) => setProjectNo(e)}
                    errorMessage={errors.project_no}
                />
                <FormTextField
                    label="Project Area"
                    value={projectArea}
                    onChangeText={(e) => setProjectArea(e)}
                    errorMessage={errors.project_area}
                />
                <FormTextField
                    label="Safety Type"
                    value={safetyType}
                    onChangeText={(e) => setSafetyType(e)}
                    errorMessage={errors.safety_type}
                />
                <FormTextField
                    label="Project Status"
                    value={projectStatus}
                    onChangeText={(e) => setProjectStatus(e)}
                    errorMessage={errors.status}
                />
                <Button title="Save" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff",
        flex: 1,
    },
    container: {
        padding: 20,
        rowGap: 16,
    },
});
