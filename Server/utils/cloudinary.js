const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "librix_unsigned_preset"); // Configure this in Cloudinary Dashboard

  const response = await fetch("https://api.cloudinary.com/v1_1/dn7hujmwl/image/upload", {
    method: "POST",
    body: formData,
  });
  
  const data = await response.json();
  return data.secure_url; // Store this URL in your DB
};