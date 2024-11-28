import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";

export default function AddRank({open, handleOpenAddRank, onAddRank, loading}) {
  const [title, setTitle] = useState("");
  const [greaterThan, setGreaterThan] = useState("");
  const [lessThan, setLessThan] = useState("");
  const [color, setColor] = useState("");
  const [sorting, setSorting] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    const newRankData = {
      title,
      greater_than: greaterThan,
      less_than: lessThan,
      color,
      sorting,
      image,
    };

    // Call the onAddRank function passed from the parent component
    await onAddRank(newRankData);

    setTitle("");
    setGreaterThan("");
    setLessThan("");
    setColor("");
    setSorting("");
    setImage("");
  };

  return (
    <Dialog open={open} handler={handleOpenAddRank}>
      <DialogHeader>Add New Ranking</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input
            label="Greater Than"
            type="number"
            value={greaterThan}
            onChange={(e) => setGreaterThan(e.target.value)}
          />
          <Input
            label="Less Than"
            type="number"
            value={lessThan}
            onChange={(e) => setLessThan(e.target.value)}
          />
          <Input label="Color" value={color} onChange={(e) => setColor(e.target.value)} />
          <Input
            label="Sorting"
            type="number"
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
          />
          <Input
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleOpenAddRank} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Button
          loading={loading}
          disabled={loading}
          variant="gradient"
          color="green"
          onClick={handleSubmit}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
