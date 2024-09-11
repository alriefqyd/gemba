import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import ProjectContext from "../context/ProjectContext";

const ProjectDetailScreen = ({ route, navigation }) => {
    const { id } = route.params; // Destructure id directly from route.params
    const [result, setResult] = useState(null);
    const { fetchProjectDetail, currentProject } = useContext(ProjectContext);

    // Fetch project details every time the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchProjectDetail(id);
        }, [id])
    );

    // Update the `result` state when `currentProject` changes
    useEffect(() => {
        if (currentProject) {
            setResult(currentProject);
        }
    }, [currentProject]);

    // Function to render individual findings
    const renderFinding = ({ item }) => (
        <View style={styles.findingItem}>
            <Text>Finding Description: {item.finding_description}</Text>
            <Text>Action Description: {item.action_description}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Finding Type: {item.finding_type}</Text>
            <Text>Safety Officer: {item.safety_officer}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Supervisor: {item.supervisor ? item.supervisor : 'N/A'}</Text>
            <Text>https://bba9-114-8-141-93.ngrok-free.app/{item.image}</Text>
            {item.image && <Image source={{ uri: `http://localhost:8005/storage/${item.image}` }} style={styles.image} />}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>Project Detail</Text>
            {result ? (
                <>
                    <Text>Title: {result.project_title}</Text>
                    <Text>No: {result.project_no}</Text>
                    <Text>Area: {result.project_area}</Text>
                    <Text>Findings:</Text>
                    
                    {result.findings && result.findings.length > 0 ? (
                        <FlatList
                            data={result.findings}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderFinding}
                        />
                    ) : (
                        <Text>No findings available.</Text>
                    )}

                    <Button title="Edit" onPress={() => navigation.navigate('Update Project', { id: result.id })} />
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
    findingItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#cbd5e1",
    }
});

export default ProjectDetailScreen;
