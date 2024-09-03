import React, { useEffect, useState, useContext } from "react";
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from "../context/AuthContext";
import { deleteProject, getProjectList } from "../services/ProjectService";
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProjectScreen({ navigation }) {

    const { user, setUser } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // for auto refresh
    // useFocusEffect(
    //     React.useCallback(() => {
    //         fetchProjects();
    //     }, [])
    // );

    useEffect(() => {
        fetchProjects();
    }, [])

    const fetchProjects = async () => {
        setRefreshing(true);
        const data = await getProjectList();
        setProjects(data.data);
        setRefreshing(false);
    };

    function handleDelete(id){
        console.log('delete')
        deleteProject(id)
        const data = getProjectList();
        setProjects(data)
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <>
                        <Text style={styles.item} onPress={()=>navigation.navigate('Detail Project', {id:item.id})}>{item.project_title}</Text>
                        <Text>{item.project_no}</Text>
                        <Button title="Delete" onPress={() => handleDelete(item.id)}></Button>
                    </>
                )}
                refreshing={refreshing}
                onRefresh={fetchProjects}
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
