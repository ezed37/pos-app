import axiosInstance from "./axiosInstance";

export const getAllCategory = async () => {
  try {
    const response = await axiosInstance.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (categoryData) => {
  const response = await axiosInstance.post("/category", categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  return axiosInstance.delete(`/category/${id}`);
};

export const updateCategory = async (id, updatedCategory) => {
  return axiosInstance.put(`/category/${id}`, updatedCategory);
};
