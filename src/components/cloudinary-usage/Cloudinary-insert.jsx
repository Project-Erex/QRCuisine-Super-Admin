import React, {useState, useEffect} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  DialogFooter,
  IconButton,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import {insertCloudinaryData} from "@/apis/cloudinary-apis";
import {XMarkIcon} from "@heroicons/react/24/solid";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeWFnbHZ4dXppcWZjeHd0eW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3Mjc3OTQsImV4cCI6MjA0MjMwMzc5NH0.NCYQ-48zeXzqSeeAsGS_voi5T8LdONE9NXxdvIxOrYU"; // Replace with your actual Supabase key

export default function CloudinaryInsert({open, handleOpen}) {
  const [formData, setFormData] = useState({
    title: "",
    cloud_name: "",
    upload_preset: "",
    apiKey: "",
    apiSecret: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // For loading state
  const [validateCloudinary, setValidateCloudinary] = useState(null); // To store validation response

  // Handle form input changes
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation function
  const validateForm = () => {
    let tempErrors = {};

    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.cloud_name) tempErrors.cloud_name = "Cloud Name is required";
    if (!formData.upload_preset) tempErrors.upload_preset = "Upload Preset is required";
    if (!formData.apiKey) tempErrors.apiKey = "API Key is required";
    if (!formData.apiSecret) tempErrors.apiSecret = "API Secret is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  // Function to validate Cloudinary credentials
  const validateCloudinaryCredentials = async () => {
    setLoading(true); // Set loading state to true
    const {cloud_name, upload_preset, apiKey, apiSecret} = formData;

    try {
      const response = await fetch(
        `https://icyaglvxuziqfcxwtymo.supabase.co/functions/v1/validate-cloudinary?cloudName=${cloud_name}&uploadPreset=${upload_preset}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`, // Use Supabase JWT authentication
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data.valid) {
        setValidateCloudinary(data);
        return true;
      } else {
        throw new Error("Invalid Cloudinary credentials.");
      }
    } catch (error) {
      console.error("Error validating Cloudinary credentials:", error);
      setErrors({api: error.message});
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const isValid = await validateCloudinaryCredentials();
    if (!isValid) return; // If not valid, stop submission

    setLoading(true); // Set loading state to true

    const {title, cloud_name, upload_preset, apiKey, apiSecret} = formData;

    try {
      await insertCloudinaryData(title, cloud_name, upload_preset, apiKey, apiSecret);
      // Reset form data if successful
      setFormData({
        title: "",
        cloud_name: "",
        upload_preset: "",
        apiKey: "",
        apiSecret: "",
      });
      setErrors({});
      handleOpen();
    } catch (error) {
      if (error.message.includes("already exists")) {
        setErrors({
          cloud_name: "Cloud name already exists. Please use a different name.",
          upload_preset: "Upload preset already exists. Please use a different value.",
          apiKey: "API key already exists. Please use a different value.",
          apiSecret: "API secret already exists. Please use a different value.",
        });
      } else {
        setErrors({api: "Failed to insert Cloudinary data"});
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          Insert Cloudinary Configuration
        </Typography>

        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleOpen}>
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="h-[20rem] overflow-y-auto py-5">
        <div className="space-y-3">
          {/* Title Field */}
          <Input
            type="text"
            name="title"
            color="gray"
            size="lg"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400`}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.title && <p className="text-red-500 text-sm ">{errors.title}</p>}

          {/* Cloud Name Field */}
          <Input
            type="text"
            name="cloud_name"
            color="gray"
            size="lg"
            placeholder="Cloud Name"
            value={formData.cloud_name}
            onChange={handleInputChange}
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400`}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.cloud_name && (
            <p className="text-red-500 text-sm">{errors.cloud_name}</p>
          )}

          {/* Upload Preset Field */}
          <Input
            type="text"
            name="upload_preset"
            color="gray"
            size="lg"
            placeholder="Upload Preset"
            value={formData.upload_preset}
            onChange={handleInputChange}
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400`}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.upload_preset && (
            <p className="text-red-500 text-sm">{errors.upload_preset}</p>
          )}

          {/* API Key Field */}
          <Input
            type="text"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleInputChange}
            placeholder="API Key"
            color="gray"
            size="lg"
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400`}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.apiKey && <p className="text-red-500 text-sm">{errors.apiKey}</p>}

          {/* API Secret Field */}
          <Input
            type="text"
            name="apiSecret"
            value={formData.apiSecret}
            onChange={handleInputChange}
            placeholder="API Secret"
            color="gray"
            size="lg"
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400`}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.apiSecret && <p className="text-red-500 text-sm">{errors.apiSecret}</p>}

          {/* Error Message from API */}
          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          className="w-40 flex items-center justify-center"
          type="submit"
          onClick={handleSubmit}
          variant="gradient"
          color="green"
          size="md"
          disabled={loading}>
          {loading ? <Spinner s /> : <span>Submit</span>}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
