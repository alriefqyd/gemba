import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { saveProject } from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";
import FormProjectGroup from "../components/FormProjectGroup";
import FormTextField from "../components/FormTextFields";
import { Text } from "react-native";
import { getToken } from "../services/TokenService";

export default function ({ navigation }) {
    const { setUser } = useContext(AuthContext);
    const { fetchProjects } = useContext(ProjectContext);

    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState("");

    const [findingList, setFindingList] = useState([{ finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"", image:""}]); // Initialize with one finding
    const [errors, setErrors] = useState({});

    // async function handleSave() {
        // setErrors({});
        // console.log(findingList)
        // try {
        //     // Save project logic here
        //     await saveProject({
        //         project_title: projectTitle,
        //         project_no: projectNo,
        //         project_area: projectArea,
        //         findings:findingList  // Changed to match backend field name
        //     });

        //     fetchProjects();
        //     navigation.navigate("Project");

        // } catch (e) {
        //     if (e.response?.status === 422) {
        //         setErrors(e.response.data.errors);
        //         console.log(errors);
        //     }
        // }
    // }

    async function handleSave() {
        setErrors({});
    
        const formData = new FormData();
    
        // Append project details
        formData.append('project_title', projectTitle);
        formData.append('project_no', projectNo);
        formData.append('project_area', projectArea);
    
        // Append each finding along with its image
        findingList.forEach((finding, index) => {
            formData.append(`findings[${index}][finding_type]`, finding.finding_type);
            formData.append(`findings[${index}][date]`, finding.date);
            formData.append(`findings[${index}][supervisor]`, finding.supervisor);
            formData.append(`findings[${index}][safety_officer]`, finding.safety_officer);
            formData.append(`findings[${index}][finding_description]`, finding.finding_description);
            formData.append(`findings[${index}][action_description]`, finding.action_description);
            formData.append(`findings[${index}][status]`, finding.status);
    
            if (finding.image) {
                formData.append(`findings[${index}][image]`, {
                    uri: finding.image,
                    name: `finding_${index}.jpg`,
                    type: 'image/jpeg',
                });
            }
        });
    

        try {
            const token = await getToken();
            const response = await fetch('http://localhost:8005/api/project', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',  // Content-Type should be automatically set by fetch for multipart
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
            { finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"",image:""}
        ]);
    };

    const handleFieldFinding = (index, field, value) => {
        const updatedFindings = [...findingList];
        //since we init finding list into an object and empty value each, index refer to num of order object and field refer to which field we eant to update value
        updatedFindings[index][field] = value;
        setFindingList(updatedFindings);
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView>
                <View style={{padding:20}}>
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
                </View>
                <Text>Finding</Text>
                {findingList.map((finding, index) => (
                    <FormProjectGroup
                        idx={index}
                        key={index}
                        findingType={finding.finding_type}
                        date={finding.date}
                        supervisor={finding.supervisor}
                        image={finding.image}
                        safetyOfficer={finding.safety_officer}
                        findingDescription={finding.finding_description}
                        actionDescription={finding.action_description}
                        status={finding.status}
                        errors={errors}
                        onImageChange={(value) => handleFieldFinding(index,'image',value)}
                        onFindingTypeChange={(value) => handleFieldFinding(index, 'finding_type', value)}
                        onDateChange={(value) => handleFieldFinding(index, 'date', value)}
                        onSupervisorChange={(value) => handleFieldFinding(index, 'supervisor', value)}
                        onSafetyOfficerChange={(value) => handleFieldFinding(index, 'safety_officer', value)}
                        onActionDescriptionChange={(value) => handleFieldFinding(index, 'action_description', value)}
                        onFindingDescriptionChange={(value) => handleFieldFinding(index, 'finding_description', value)}
                        onStatusChange={(value) => handleFieldFinding(index, 'status', value)}
                    />
                ))}
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
