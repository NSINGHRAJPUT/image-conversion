"use client";

import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState<string>("jpeg"); // Default from format
  const [toFormat, setToFormat] = useState<string>("png"); // Default to format
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  // Supported formats by 'sharp'
  const formats = [
    "heic",
    "heif",
    "avif",
    "jpeg",
    "jpg",
    "jpe",
    "tile",
    "dz",
    "png",
    "raw",
    "tiff",
    "tif",
    "webp",
    "gif",
    "jp2",
    "jpx",
    "j2k",
    "j2c",
    "jxl",
  ];

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle format change for 'From' and 'To' fields
  const handleFromFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFromFormat(e.target.value);
    // Reset 'To' format if it was the same as the new 'From' format
    if (e.target.value === toFormat) {
      setToFormat("");
    }
  };

  const handleToFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToFormat(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!selectedFile) {
      return toast.error("Please select a file to convert!");
    }
    if (!fromFormat || !toFormat) {
      return toast.error("Please select both 'From' and 'To' formats!");
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("from", fromFormat);
    formData.append("to", toFormat);

    try {
      const response = await axios.post("/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Expecting a binary file
      });

      // Create an object URL for the returned blob (image)
      const imageBlob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(imageBlob);
      setConvertedImage(imageUrl);

      toast.success("Image converted successfully!");
    } catch (error) {
      console.error("Error converting file", error);
      toast.error("Failed to convert the image!");
    }
  };

  return (
    <div className=" w-full min-h-screen py-8 bg-gray-200">
      <Toaster />
      <div className="mx-[5%] md:mx-[10%] shadow-2xl bg-white p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Image Converter</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-xl shadow-xl mx-auto p-6 bg-white border-gray-200 border-[1px] rounded-md"
        >
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select an image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4 flex justify-between">
            {/* Convert from dropdown */}
            <div className="w-1/2 mr-2">
              <label className="block mb-2 font-semibold">Convert from:</label>
              <select
                value={fromFormat}
                onChange={handleFromFormatChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Convert to dropdown */}
            <div className="w-1/2 ml-2">
              <label className="block mb-2 font-semibold">Convert to:</label>
              <select
                value={toFormat}
                onChange={handleToFormatChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {/* Only show options that are not selected as 'From' */}
                {formats
                  .filter((format) => format !== fromFormat)
                  .map((format) => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Convert Image
          </button>
        </form>

        {convertedImage && (
          <div className="mt-8 p-8 border-gray-200 border-[1px] text-center shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Converted Image:</h3>
            <div className="border border-gray-300 p-4 inline-block">
              <Image
                src={convertedImage}
                alt="Converted"
                width={400}
                height={400}
                className="w-[400px] h-[400px] object-contain"
              />
            </div>
            <div className="mt-4">
              <a
                href={convertedImage}
                download={`converted.${toFormat}`}
                className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Download Converted Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
