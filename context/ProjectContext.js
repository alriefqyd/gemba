import React, { useState, useEffect } from "react";
import { getProjectDetail, getProjectList } from "../services/ProjectService";

const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    const fetchProjects = async () => {
        setRefreshing(true);
        try {
            const data = await getProjectList();
            setProjects(data.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
        setRefreshing(false)
    };

    const fetchProjectDetail = async (id) => {
        try {
            const data = await getProjectDetail(id);
            setCurrentProject(data.data);  // Store the project data in context
        } catch (error) {
            console.error("Failed to fetch project detail:", error);
        }
    };


    return (
        <ProjectContext.Provider value={{ projects, fetchProjects, fetchProjectDetail, currentProject, setCurrentProject, refreshing }}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContext;
