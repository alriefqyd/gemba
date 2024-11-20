import React, { useEffect, useContext, useLayoutEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Text, Alert, View, Image } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from "../context/AuthContext";
import ProjectContext from "../context/ProjectContext";
import { deleteProject } from "../services/ProjectService";
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProjectScreen({ navigation }) {
    const { fetchProjects, refreshing, projects } = useContext(ProjectContext);
    const { user, setUser } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            fetchProjects();
        }, [])
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Project",
            "Are you sure you want to delete this project?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProject(id);
                            Alert.alert("Success", "Project deleted successfully");
                            fetchProjects();
                        } catch (error) {
                            console.error("Failed to delete project:", error);
                            Alert.alert("Error", "Failed to delete project");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>SIGEMOY</Text>
                <TouchableOpacity onPress={() => setShowLogout(true)}>
                    <Text>{user.name}</Text>
                    {/* <Image source={require('../assets/setting-icon.png')} style={styles.settingsIcon} /> */}
                </TouchableOpacity>
            </View>
            <FlatList
                data={projects}
                style={{marginBottom:80}}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.projectCard}>
                        <Image
                            source={require('../assets/background.png')}
                            style={styles.projectImage}
                        />
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Detail Reports', { id: item.id })}
                            style={styles.projectInfo}
                        >
                            <Text style={styles.projectTitle}>{item.project_title}</Text>
                            <Text style={styles.projectNo}>{item.project_no}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                            <Icon name="trash-outline" size={24} color="#f4511e" />
                        </TouchableOpacity>
                    </View>
                )}
                refreshing={refreshing}
                onRefresh={fetchProjects}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    projectCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    projectImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 16,
    },
    projectInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#017f7c',
    },
    projectNo: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    deleteButton: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
