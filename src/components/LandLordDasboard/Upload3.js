import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PropertyFormPage3 = ({
  propertyDetails,
  setPropertyDetails,
  onSubmit,
  isFormSubmitted,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Reset errors when form is submitted or reset
    if (isFormSubmitted) {
      setErrors({});
    }
  }, [isFormSubmitted]);

  const handleFileUpload = (e, fileCategory, acceptedTypes, maxFileSize, maxCount) => {
    const files = Array.from(e.target.files);

    // Check if the number of files exceeds the allowed count
    if (files.length + (propertyDetails[fileCategory]?.length || 0) > maxCount) {
      toast.error(`You can upload a maximum of ${maxCount} files for ${fileCategory}.`);
      return;
    }

    const validFiles = [];

    files.forEach((file) => {
      // Check MIME type for the file
      const fileType = file.type;

      // Create an array of valid MIME types from the acceptedTypes string
      const validTypes = acceptedTypes.split(",").map((type) => type.trim());

      if (!validTypes.includes(fileType)) {
        toast.error(`Invalid file type for ${file.name}. Accepted types: ${acceptedTypes}.`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB.`);
        return;
      }

      validFiles.push(file);
    });

    // Set the uploaded valid files
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [fileCategory]: [
        ...(prevDetails[fileCategory] || []),
        ...validFiles,
      ], // Append the valid files to the existing files
    }));
  };

  const handleDrop = (e, fileCategory, acceptedTypes, maxFileSize, maxCount) => {
    e.preventDefault();
    e.target.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);

    // Check if the number of files exceeds the allowed count
    if (files.length + (propertyDetails[fileCategory]?.length || 0) > maxCount) {
      toast.error(`You can upload a maximum of ${maxCount} files for ${fileCategory}.`);
      return;
    }

    const validFiles = [];

    files.forEach((file) => {
      // Check MIME type for the file
      const fileType = file.type;

      // Create an array of valid MIME types from the acceptedTypes string
      const validTypes = acceptedTypes.split(",").map((type) => type.trim());

      if (!validTypes.includes(fileType)) {
        toast.error(`Invalid file type for ${file.name}. Accepted types: ${acceptedTypes}.`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB.`);
        return;
      }

      validFiles.push(file);
    });

    // Set the uploaded valid files
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [fileCategory]: [
        ...(prevDetails[fileCategory] || []),
        ...validFiles,
      ], // Append the valid files to the existing files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};

// Validate required fields and check file counts
const fileCategories = [
  { name: "photos", maxCount: 10, required: true },
  { name: "floorPlans", maxCount: 5, required: true },
  { name: "inventory", maxCount: 5, required: false }, // Inventory is now optional
  { name: "epc", maxCount: 1, required: true },
  { name: "gasCertificate", maxCount: 1, required: true },
  { name: "eicr", maxCount: 1, required: true },
  { name: "insurance", maxCount: 1, required: true },
];

fileCategories.forEach(({ name, maxCount, required }) => {
  if (required && (!propertyDetails[name] || propertyDetails[name].length === 0)) {
    formErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} are required.`;
  } else if (propertyDetails[name] && propertyDetails[name].length > maxCount) {
    formErrors[name] = `You can upload a maximum of ${maxCount} files for ${name}.`;
  }
});

    // If there are validation errors, update state and stop submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // No errors, submit to parent
    onSubmit(propertyDetails);
  };

  const renderUploadedFiles = (files, fileCategory) => {
    return (
      <ul className="mt-2 text-sm text-gray-600">
        {files.map((file, index) => (
          <li key={index} className="flex justify-between items-center truncate">
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
  {file.name}
</span>

            <button
              className="ml-4 text-red-500 hover:text-red-700"
              onClick={() => handleFileDelete(fileCategory, index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const renderFileInput = (
    label,
    fileCategory,
    maxFileSize,
    acceptedTypes,
    maxCount,
    helperText
  ) => (
    <div>
      <label className="block text-lg font-medium text-gray-700 mb-2">{label}</label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, fileCategory, acceptedTypes, maxFileSize, maxCount)}
        onClick={() => document.getElementById(`${fileCategory}Input`).click()}
      >
        <p className="text-gray-600">Drag and drop files here, or click to upload</p>
        <input
          id={`${fileCategory}Input`}
          type="file"
          accept={acceptedTypes}
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e, fileCategory, acceptedTypes, maxFileSize, maxCount)}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{helperText}</p>
      {errors[fileCategory] && (
        <p className="text-sm text-red-500 mt-2">{errors[fileCategory]}</p>
      )}
      {renderUploadedFiles(propertyDetails[fileCategory] || [], fileCategory)}
    </div>
  );

  const handleFileDelete = (fileCategory, index) => {
    setPropertyDetails((prev) => {
      const updatedFiles = prev[fileCategory].filter((_, i) => i !== index);
      return { ...prev, [fileCategory]: updatedFiles };
    });
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white shadow-md rounded-lg">
      {/* Alerts for Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-4">
          {Object.entries(errors).map(([field, errorMessage]) => (
            <div
              key={field}
              className="text-red-600 bg-red-100 border border-red-400 rounded p-2 mb-2"
            >
              {errorMessage}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderFileInput(
          "Upload Property Images",
          "photos",
          10 * 1024 * 1024, // 10MB
          "image/jpeg,image/png,image/jpg,application/pdf",
          10,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 10MB per file. Max uploads: 10 files."
        )}

        {renderFileInput(
          "Upload Floor Plan Images",
          "floorPlans",
          10 * 1024 * 1024, // 10MB
          "image/jpeg,image/png,image/jpg,application/pdf",
          5,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 10MB per file. Max uploads: 5 files."
        )}
{/* Conditional File Input */}
{(propertyDetails.furnished === "Furnished" || propertyDetails.furnished === "Partly Furnished") && (
  renderFileInput(
    "Upload Inventory",
    "inventory",
    10 * 1024 * 1024, // 10MB
    "image/jpeg,image/png,image/jpg,application/pdf",
    5,
    "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 10MB per file. Max uploads: 5 files."
  )
)}


        {renderFileInput(
          "Upload EPC",
          "epc",
          5 * 1024 * 1024, // 5MB
          "application/pdf,image/jpeg,image/png,image/jpg",
          1,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 5MB per file. Max uploads: 1 file."
        )}

        {renderFileInput(
          "Upload Gas Certificate",
          "gasCertificate",
          5 * 1024 * 1024, // 5MB
          "application/pdf,image/jpeg,image/png,image/jpg",
          1,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 5MB per file. Max uploads: 1 file."
        )}

        {renderFileInput(
          "Upload EICR",
          "eicr",
          5 * 1024 * 1024, // 5MB
          "application/pdf,image/jpeg,image/png,image/jpg",
          1,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 5MB per file. Max uploads: 1 file."
        )}

        {renderFileInput(
          "Upload Insurance",
          "insurance",
          5 * 1024 * 1024, // 5MB
          "application/pdf,image/jpeg,image/png,image/jpg",
          1,
          "Accepted file types: JPG, JPEG, PNG, PDF. Max file size: 5MB per file. Max uploads: 1 file."
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-custom-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            style={{ backgroundColor: "#a53864" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFormPage3;
