import React, {useState} from "react";
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) return;

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
      setErrors({}); // Clear any errors on success
    } catch (error) {
      console.error("Error inserting data: ", error);
      setErrors({api: "Failed to insert Cloudinary data"}); // Set API error
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
      <DialogBody className="h-[20rem]  overflow-y-auto py-5">
        <div onSubmit={handleSubmit} className="space-y-3">
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
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          {/* Cloud Name Field */}
          <Input
            type="text"
            name="cloud_name"
            color="gray"
            size="lg"
            placeholder="Cloud Name"
            value={formData.cloud_name}
            onChange={handleInputChange}
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400 `}
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
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400 `}
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
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400 `}
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
            className={`placeholder:opacity-100 focus:!border-t-gray-900 !border-t-gray-400 `}
            containerProps={{className: "!min-w-full"}}
            labelProps={{className: "hidden"}}
          />
          {errors.apiSecret && <p className="text-red-500 text-sm">{errors.apiSecret}</p>}

          {/* Error Message from API */}
          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

          {/* Submit Button */}
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
          disabled={!errors || loading}>
          {loading ? <Spinner s /> : <span>Submit</span>}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
