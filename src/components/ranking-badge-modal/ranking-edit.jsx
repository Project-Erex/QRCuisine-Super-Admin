import React, {useState, useEffect} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

export default function RankingEdit({
  open,
  handleOpen,
  selectedRanking,
  onConfirm,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    greater_than: "",
    less_than: "",
    color: "",
    sorting: "",
  });

  console.log("first", selectedRanking);

  useEffect(() => {
    if (selectedRanking) {
      setFormData({
        title: selectedRanking.title || "",
        greater_than: selectedRanking.greater_than || "",
        less_than: selectedRanking.less_than || "",
        color: selectedRanking.color || "",
        sorting: selectedRanking.sorting || "",
      });
    }
  }, [selectedRanking]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      greater_than: formData.greater_than ? Number(formData.greater_than) : null,
      less_than: formData.less_than ? Number(formData.less_than) : null,
      sorting: formData.sorting ? Number(formData.sorting) : null,
    };

    console.log("Updated Data:", updatedData);
    onConfirm(updatedData);
  };

  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          Ranking Edit
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}>
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              label="Greater Than"
              name="greater_than"
              type="number"
              value={formData.greater_than}
              onChange={handleChange}
            />
            <Input
              label="Less Than"
              name="less_than"
              type="number"
              value={formData.less_than}
              onChange={handleChange}
            />
            <Input
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <Input
              label="Sorting"
              name="sorting"
              type="number"
              value={formData.sorting}
              onChange={handleChange}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-2">
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            loading={loading}
            color="green"
            disabled={loading}
            onClick={handleSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
