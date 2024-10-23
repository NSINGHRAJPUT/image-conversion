"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState("png"); // Default format
  const [convertedImage, setConvertedImage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("format", format);

    try {
      const response = await axios.post("api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // We expect a binary file in return
      });

      // Create an object URL for the returned blob (image)
      const imageBlob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(imageBlob);
      setConvertedImage(imageUrl);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div className="App">
      <h1>Image Converter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select an image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Select format:</label>
          <select value={format} onChange={handleFormatChange}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
        <button type="submit">Convert Image</button>
      </form>

      {convertedImage && (
        <div>
          <h3>Converted Image:</h3>
          <img
            src={convertedImage}
            alt="Converted"
            style={{ maxWidth: "100%" }}
          />
          <a href={convertedImage} download={`converted.${format}`}>
            Download Converted Image
          </a>
        </div>
      )}
    </div>
  );
}
