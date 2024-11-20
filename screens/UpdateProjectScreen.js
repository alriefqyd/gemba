import {
    Alert,
    Button,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import FormTextField from "../components/FormTextFields";
import { useState, useContext, useEffect, useLayoutEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
    getProjectDetail,
    saveProject,
    updateProject,
} from "../services/ProjectService";
import ProjectContext from "../context/ProjectContext";
import FormProjectGroup from "../components/FormProjectGroup";
import { getToken } from "../services/TokenService";
import { API_URL } from "../src/config";
import Icon from "react-native-vector-icons/Ionicons";

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
    const [findingList, setFindingList] = useState([
        {
            finding_type: "",
            date: "",
            supervisor: "",
            safety_officer: "",
            finding_description: "",
            action_description: "",
            status: "",
            id: "",
            image: "",
        },
    ]);

    const { fetchProjects, currentProject, setCurrentProject } =
        useContext(ProjectContext);

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

        formData.append("project_title", projectTitle);
        formData.append("project_no", projectNo);
        formData.append("project_area", projectArea);
        formData.append("project_id", id);
        formData.append("_method", "PUT");

        findingList.forEach((finding, index) => {
            if (finding.id) {
                formData.append(`findings[${index}][id]`, finding.id);
            }
            formData.append(`findings[${index}][finding_type]`, finding.finding_type);
            formData.append(`findings[${index}][date]`, finding.date);
            formData.append(`findings[${index}][supervisor]`, finding.supervisor);
            formData.append(
                `findings[${index}][safety_officer]`,
                finding.safety_officer
            );
            formData.append(
                `findings[${index}][finding_description]`,
                finding.finding_description
            );
            formData.append(
                `findings[${index}][action_description]`,
                finding.action_description
            );
            formData.append(`findings[${index}][status]`, finding.status);

            if (finding.image) {
                if (finding.image.includes("file://")) {
                    formData.append(`findings[${index}][image]`, {
                        uri: finding.image,
                        name: `finding_${index}.jpg`,
                        type: "image/jpeg",
                    });
                } else {
                    formData.append(`findings[${index}][image]`, finding.image);
                }
            }
        });

        try {
            const token = await getToken();
            const response = await fetch(`${API_URL}/api/project/${id}`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 422) {
                    setErrors(errorData.errors);
                } else {
                    Alert.alert("Error", "An error occurred while saving the project");
                }
            } else {
                fetchProjects();
                navigation.navigate("Reports");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save the project");
        }
    }

    const handleNewFinding = () => {
        setFindingList([
            ...findingList,
            {
                finding_type: "",
                date: "",
                supervisor: "",
                safety_officer: "",
                finding_description: "",
                action_description: "",
                status: "",
                id: "",
                image: "",
            },
        ]);
    };

    const handleFieldFinding = (index, field, value) => {
        const updatedFindings = [...findingList];
        updatedFindings[index][field] = value;
        if (!updatedFindings[index].id) {
            updatedFindings[index].id = null;
        }
        setFindingList(updatedFindings);
    };

    const handleDeleteFinding = (index) => {
        setFindingList(findingList.filter((_, i) => i !== index));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Reports")}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#1A73E8" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Update Reports", { id })}
                    style={styles.editButton}
                >
                    <Icon name="pencil" size={24} color="#1A73E8" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, id]);

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
            <ScrollView>
                <View style={styles.container}>
                <Text style={styles.title}>Edit Report</Text>
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
                <View style={styles.findingsContainer}>
                <Text style={styles.sectionTitle}>Findings</Text>
                    {findingList.length > 0 ? (
                        findingList.map((finding, index) => (
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
                                image={
                                    finding.image.includes("file://")
                                        ? finding.image
                                        : `${API_URL}/storage/${finding.image}`
                                }
                                onImageChange={(value) =>
                                    handleFieldFinding(index, "image", value)
                                }
                                onFindingTypeChange={(value) =>
                                    handleFieldFinding(index, "finding_type", value)
                                }
                                onDateChange={(value) =>
                                    handleFieldFinding(index, "date", value)
                                }
                                onSupervisorChange={(value) =>
                                    handleFieldFinding(index, "supervisor", value)
                                }
                                onSafetyOfficerChange={(value) =>
                                    handleFieldFinding(index, "safety_officer", value)
                                }
                                onActionDescriptionChange={(value) =>
                                    handleFieldFinding(index, "action_description", value)
                                }
                                onFindingDescriptionChange={(value) =>
                                    handleFieldFinding(index, "finding_description", value)
                                }
                                onStatusChange={(value) =>
                                    handleFieldFinding(index, "status", value)
                                }
                                onDelete={() => handleDeleteFinding(index)}
                            />
                        ))
                    ) : (
                        <Text>Loading...</Text>
                    )}
                    <TouchableOpacity style={styles.addButton} onPress={handleNewFinding}>
                    <Text style={styles.buttonText}>Add New Finding</Text>
                </TouchableOpacity>
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#f7f7f7",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        color: "#ecb220",
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: "#24695c",
        flexDirection: "row",
        padding: 8,
        alignItems: "center",
        borderRadius: 6,
    },
    saveButtonText: {
        fontSize: 16,
        color: "#fff",
        marginLeft: 5,
    },
    findingsContainer: {
        padding: 15,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: "#555",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: "#333",
        marginBottom: 15,
    },
});

