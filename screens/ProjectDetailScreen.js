import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import ProjectContext from "../context/ProjectContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from "../src/config";

const ProjectDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [result, setResult] = useState(null);
    const { fetchProjectDetail, currentProject } = useContext(ProjectContext);

    useFocusEffect(
        React.useCallback(() => {
            fetchProjectDetail(id);
        }, [id])
    );

    useEffect(() => {
        if (currentProject) {
            setResult(currentProject);
        }
    }, [currentProject]);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // Set up the header with back and edit buttons
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Reports')} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#1A73E8" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Update Reports', { id })}
                    style={styles.editButton}
                >
            
                    <Icon name="pencil" size={24} color="#1A73E8" />
                    {/* <Text style={styles.editButtonText}>Edit</Text> */}
                </TouchableOpacity>
            ),
        });
    }, [navigation, id]);

    const renderFinding = ({ item }) => (
        <View style={styles.findingCard}>
            <Text style={styles.findingText}>Description: {item.finding_description}</Text>
            <Text style={styles.findingText}>Action: {item.action_description}</Text>
            <Text style={styles.findingText}>Date: {item.date}</Text>
            <Text style={styles.findingText}>Type: {item.finding_type}</Text>
            <Text style={styles.findingText}>Safety Officer: {item.safety_officer}</Text>
            <Text style={styles.findingText}>Status: {item.status}</Text>
            <Text style={styles.findingText}>Supervisor: {item.supervisor ? item.supervisor : 'N/A'}</Text>
            {item.image && (
                <Image 
                    source={{ uri: `${API_URL}/storage/${item.image}` }} 
                    style={styles.image} 
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#ecb220" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Update Reports', { id })} style={styles.editButton}>
                    <Icon name="pencil" size={24} color="#ecb220" />
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />

            {result ? (
                <>
                    <Text style={styles.projectTitle}>{result.project_title}</Text>
                    <Text style={styles.projectInfo}>Project No: {result.project_no}</Text>
                    <Text style={styles.projectInfo}>Area: {result.project_area}</Text>
                    <Text style={styles.sectionTitle}>Findings</Text>
                    
                    {result.findings && result.findings.length > 0 ? (
                        <FlatList
                            data={result.findings}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderFinding}
                        />
                    ) : (
                        <Text style={styles.noFindingsText}>No findings available.</Text>
                    )}
                </>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#017f7c',
        marginBottom: 8,
    },
    projectInfo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#017f7c',
        marginTop: 20,
        marginBottom: 10,
    },
    findingCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    findingText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    noFindingsText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
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
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
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

export default ProjectDetailScreen;
