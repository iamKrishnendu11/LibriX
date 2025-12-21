const fetchBookDetails = async (isbn) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data = await response.json();

    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;
      // Update your React State / Formik values
      setFormData({
        title: book.title || "",
        author: book.authors?.join(", ") || "",
        description: book.description || "",
        category: book.categories?.[0] || "",
        coverImage: book.imageLinks?.thumbnail || "",
        publishingYear: book.publishedDate?.split("-")[0] || ""
      });
    }
  } catch (error) {
    console.error("Error fetching book data:", error);
  }
};