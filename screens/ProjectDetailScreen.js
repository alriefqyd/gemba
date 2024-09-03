import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Button } from 'react-native';
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

    return (
        <View style={styles.container}>
            <Text>Project Detail</Text>
            {result ? (
                <>
                    <Text>Title: {result.project_title}</Text>
                    <Text>No: {result.project_no}</Text>
                    <Text>Area: {result.project_area}</Text>
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
});

export default ProjectDetailScreen;
