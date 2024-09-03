import axios from "../utils/axios";

export async function getProjectList(credentials){
    const {data} = await axios.get("/project", credentials)
    return data;
}


export async function saveProject(credentials){
    const {data} = await axios.post("/project", credentials)
    return data;
}

export async function getProjectDetail(id){
    const {data} = await axios.get(`/project/${id}`);
    return data;
}

export async function deleteProject(id){
    const {data} = await axios.delete(`/project/${id}`);
    return data;
}

export async function updateProject(id,payload) {
    const {data} = await axios.put(`/project/${id}`,payload);
    return data;
}


