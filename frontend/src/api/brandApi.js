import axiosInstance from "./axiosInstance";

export const getAllBrand = async () => {
  try {
    const response = await axiosInstance.get("/brand");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const addBrand = async (BrandData) => {
  const response = await axiosInstance.post("/brand", BrandData);
  return response.data;
};

export const deleteBrand = async (id) => {
  return axiosInstance.delete(`/brand/${id}`);
};

export const updateBrand = async (id, updatedBrand) => {
  return axiosInstance.put(`/brand/${id}`, updatedBrand);
};
