import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tasks"; // Sesuaikan dengan backend

export const getTasks = async () => {
    const response = await axios.get(API_URL);
    console.log("API Response:", response.data); // Debugging
    return response.data.data ?? []; // Ambil array dari 'data'
  };
  
  
export const addTask = async (task: { title: string }) => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateTask = async (id: number, updatedTask: any) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedTask);
  return response.data;
};
