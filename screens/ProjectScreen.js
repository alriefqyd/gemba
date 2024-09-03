import React, { useEffect, useContext } from "react";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Text, Button, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from "../context/AuthContext";
import { deleteProject } from "../services/ProjectService";
import Icon from 'react-native-vector-icons/Ionicons';
import ProjectContext from "../context/ProjectContext";

export default function ProjectScreen({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const { fetchProjects, refreshing, projects } = useContext(ProjectContext);

    // Automatically refresh the project list when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchProjects();
        }, [])
    );

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            Alert.alert("Success", "Project deleted successfully");
            fetchProjects(); // Refresh the project list after deletion
        } catch (error) {
            console.error("Failed to delete project:", error);
            Alert.alert("Error", "Failed to delete project");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <>
                        <Text style={styles.item} onPress={() => navigation.navigate('Detail Project', { id: item.id })}>
                            {item.project_title}
                        </Text>
                        <Text>{item.project_no}</Text>
                        <Button title="Delete" onPress={() => handleDelete(item.id)} />
                    </>
                )}
                refreshing={refreshing}
                onRefresh={fetchProjects} // Pull-to-refresh functionality
            />
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => {
                    navigation.navigate("Add Project");
                }}
            >
                <Icon name="add-circle" size={60} color="#f4511e" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'transparent',
    },
});
