import { useState, useEffect } from "react";
import { getCategories } from "../services/apiService";
import { Category } from "../models/CategoryModel";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Fetch the categories
        setCategories(data); // Set the fetched categories
      } catch (error: unknown) {
        // Cast error to 'unknown' type to handle it properly
        if (error instanceof Error) {
          setError(error.message); // Access message if error is of type 'Error'
        } else {
          setError("An unknown error occurred"); // Fallback for unknown errors
        }
        console.error(error); // Log the error for debugging
      } finally {
        setLoading(false); // Set loading to false once the request is finished
      }
    };

    fetchCategories();
  }, []);

  // Function to update the selected category
  const updateSelectedCategory = (categoryId: Category) => {
    setSelectedCategory(categoryId); // Update the selected category state
  };

  return {
    categories,
    loading,
    error,
    selectedCategory,
    updateSelectedCategory,
  };
};

export default useCategories;
