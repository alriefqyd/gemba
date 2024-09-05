import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { getProjectDetail, saveProject, updateProject } from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";
import FormProjectGroup from "../components/FormProjectGroup";

export default function ({ route, navigation }) {
    const { setUser } = useContext(AuthContext);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [project, setProject] = useState({});
    const [findingList, setFindingList] = useState([{ finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"", id:""}]); // Initialize with one finding
    

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
            setFindingList(data.data.findings);
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
                findings:findingList
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

    const handleNewFinding = () => {
        setFindingList([
            ...findingList,
            { finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"",id:""}
        ]);
    };

    const handleFieldFinding = (index, field, value) => {
        const updatedFindings = [...findingList];
        //since we init finding list into an object and empty value each, index refer to num of order object and field refer to which field we eant to update value
        updatedFindings[index][field] = value;
        setFindingList(updatedFindings);
    }

    const handleDeleteFinding = (index) => {
        setFindingList(findingList.filter((_, i) => i !== index));
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView>
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
            </View>
            <View style={{marginTop:"20px"}}>
                {findingList && findingList.length > 0 ? findingList.map((finding, index) => (
                        <FormProjectGroup
                            key={index}
                            findingType={finding.finding_type}
                            date={finding.date}
                            supervisor={finding.supervisor}
                            safetyOfficer={finding.safety_officer}
                            findingDescription={finding.finding_description}
                            actionDescription={finding.action_description}
                            status={finding.status}
                            errors={errors}
                            onFindingTypeChange={(value) => handleFieldFinding(index, 'finding_type', value)}
                            onDateChange={(value) => handleFieldFinding(index, 'date', value)}
                            onSupervisorChange={(value) => handleFieldFinding(index, 'supervisor', value)}
                            onSafetyOfficerChange={(value) => handleFieldFinding(index, 'safety_officer', value)}
                            onActionDescriptionChange={(value) => handleFieldFinding(index, 'action_description', value)}
                            onFindingDescriptionChange={(value) => handleFieldFinding(index, 'finding_description', value)}
                            onStatusChange={(value) => handleFieldFinding(index, 'status', value)}
                            onDelete={() => handleDeleteFinding(index)}
                        />
                    )) : <Text>'Loading ...'</Text>}
            </View>
            <Button title="Add New Finding" onPress={handleNewFinding} />
            <Button title="Save" onPress={handleSave} />
            </ScrollView>
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
