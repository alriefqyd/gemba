import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { getProjectDetail, saveProject, updateProject } from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";
import FormProjectGroup from "../components/FormProjectGroup";
import { getToken } from "../services/TokenService";

export default function ({ route, navigation }) {
    const { setUser } = useContext(AuthContext);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [project, setProject] = useState({});
    const [image, setImage] = useState({});
    const [findingList, setFindingList] = useState([{ finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"", id:"", image:""}]); // Initialize with one finding
    

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

    async function handleSave() {
        setErrors({});
    
        const formData = new FormData();
    
        // Append project details
        formData.append('project_title', projectTitle);
        formData.append('project_no', projectNo);
        formData.append('project_area', projectArea);
        formData.append('project_id', id);
        formData.append('_method', 'PUT');
    

        // Append each finding along with its image
        findingList.forEach((finding, index) => {
            // Only append the id if it exists, indicating an existing finding
            if (finding.id) {
                formData.append(`findings[${index}][id]`, finding.id);
            }
    
            formData.append(`findings[${index}][finding_type]`, finding.finding_type);
            formData.append(`findings[${index}][date]`, finding.date);
            formData.append(`findings[${index}][supervisor]`, finding.supervisor);
            formData.append(`findings[${index}][safety_officer]`, finding.safety_officer);
            formData.append(`findings[${index}][finding_description]`, finding.finding_description);
            formData.append(`findings[${index}][action_description]`, finding.action_description);
            formData.append(`findings[${index}][status]`, finding.status);
    
            // Handle image upload, both for local and server-stored images
            if (finding.image) {
                if (finding.image.includes('file://')) {
                    // For local file uploads
                    formData.append(`findings[${index}][image]`, {
                        uri: finding.image,
                        name: `finding_${index}.jpg`,
                        type: 'image/jpeg',
                    });
                } else {
                    // For images already stored on the server
                    formData.append(`findings[${index}][image]`, finding.image);
                }
            }
        });

    
        try {
            const token = await getToken();
            const response = await fetch(`http://localhost:8005/api/project/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Content-Type should be automatically set by fetch for multipart
                    'Authorization': `Bearer ${token}`,  // If you're using token-based authentication
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 422) {
                    setErrors(errorData.errors);
                } else {
                    Alert.alert('Error', 'An error occurred while saving the project');
                }
            } else {
                // Handle successful response
                fetchProjects();  // Optionally refresh project list
                navigation.navigate("Project");
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save the project');
        }
    }
    

    const handleNewFinding = () => {
        setFindingList([
            ...findingList,
            { finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"",id:"", image:""}
        ]);
    };

    const handleFieldFinding = (index, field, value) => {
        const updatedFindings = [...findingList];
        updatedFindings[index][field] = value;
        if (!updatedFindings[index].id) {
            updatedFindings[index].id = null;  // Or set a default value
        }
        setFindingList(updatedFindings);
    };

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
                            image={finding.image.includes('file://') ? finding.image : `http://localhost:8005/storage/${finding.image}`}
                            onImageChange={(value) => handleFieldFinding(index, 'image',value)}
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
