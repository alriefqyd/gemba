import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { getProjectDetail } from "../services/ProjectService";

const ProjectDetailScreen = ({ route, navigation }) => {
    const { id } = route.params; // Destructure id directly from route.params
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (id) { // Check if id is available
            fetchProjects(id);
        }
    }, [id]); // Add id as a dependency to refetch if it changes

    const fetchProjects = async (id) => {
        try {
            const data = await getProjectDetail(id);
            setResult(data.data); // Assuming data is already the project detail
        } catch (error) {
            console.error("Failed to fetch project detail:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Project Detail</Text>
            {result ? (
                <>
                    <Text>Title: {result.project_title}</Text>
                    <Text>No: {result.project_no}</Text>
                    <Text>Area: {result.project_area}</Text>
                    {/* Add more details as necessary */}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default ProjectDetailScreen;
