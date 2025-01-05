import { useState, useEffect } from "react";
import { getCategories } from "../services/apiService";
import { Category } from "../models/CategoryModel";
import { useSearchDebounce } from "./useSearchDebounce";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const debouncedSearchCategory = useSearchDebounce(searchCategory, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(debouncedSearchCategory); 
        setCategories(data); 
      } catch (error: unknown) {
         if (error instanceof Error) {
          setError(error.message);  
        } else {
          setError("An unknown error occurred"); 
        }
        console.error(error);  
      } finally {
        setLoading(false);  
      }
    };

    fetchCategories();
  }, [debouncedSearchCategory]);

  const handleSearchCategory = (searchTerm: string) => {
    setSearchCategory(searchTerm);
  };

  // Function to update the selected category
  const updateSelectedCategory = (categoryId: Category) => {
    setSelectedCategory(categoryId); // Update the selected category state
  };

  return {
    categories,
    loading,
    error,
    selectedCategory,
    searchCategory,
    handleSearchCategory,
    updateSelectedCategory,
  };
};

export default useCategories;
