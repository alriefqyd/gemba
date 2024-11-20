import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useState, useContext, useLayoutEffect } from "react";
import AuthContext from "../context/AuthContext";
import { saveProject } from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";
import FormProjectGroup from "../components/FormProjectGroup";
import FormTextField from "../components/FormTextFields";
import { Text, TouchableOpacity } from "react-native";
import { getToken } from "../services/TokenService";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from "../src/config";

export default function ({ navigation }) {
    const { setUser } = useContext(AuthContext);
    const { fetchProjects } = useContext(ProjectContext);

    const [projectTitle, setProjectTitle] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [safetyType, setSafetyType] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState("");

    const [findingList, setFindingList] = useState([{ finding_type: "", date: "", supervisor: "", safety_officer: "", finding_description:"", action_description: "" , status:"", image:""}]);
    const [errors, setErrors] = useState({});

    const handleDeleteFinding = (index) => {
        setFindingList(findingList.filter((_, i) => i !== index));
    };

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#1A73E8" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Update Project', { id })}
                    style={styles.editButton}
                >
            
                    <Icon name="pencil" size={24} color="#1A73E8" />
                    {/* <Text style={styles.editButtonText}>Edit</Text> */}
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    async function handleSave() {
        setErrors({});
        const formData = new FormData();

        formData.append('project_title', projectTitle);
        formData.append('project_no', projectNo);
        formData.append('project_area', projectArea);

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
            const response = await fetch(`${API_URL}/api/project`, {
                method: 'POST',
                body: formData,
                headers: {
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
                fetchProjects();
                navigation.navigate("Reports");
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
        updatedFindings[index][field] = value;
        setFindingList(updatedFindings);
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#ecb220" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Icon name="save" size={24} color="#fff" />
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Create New Report</Text>
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
                    
                    <Text style={styles.sectionTitle}>Findings</Text>
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
                            onDelete={() => handleDeleteFinding(index)}
                        />
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={handleNewFinding}>
                        <Text style={styles.buttonText}>Add New Finding</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#F7F9FC",
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        color: '#ecb220',
        marginLeft: 5,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        color: '#ecb220',
        marginRight: 5,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: "#333",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: "#555",
        marginTop: 20,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: "#24695c",
        flexDirection: "row",
        padding: 8,
        alignItems: "center",
        borderRadius: 6,
        marginRight:10
    },
    saveButtonText: {
        fontSize: 16,
        color: "#fff",
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        marginBottom:80
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "600",
    },
    backButtonText: {
        fontSize: 16,
        color: '#ecb220',
        marginLeft: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerDivider: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        marginBottom: 16,
    },
});
