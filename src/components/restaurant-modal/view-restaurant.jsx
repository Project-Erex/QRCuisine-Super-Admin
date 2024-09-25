import React, {useEffect} from "react";
import {Drawer, Typography, IconButton, Avatar, Chip} from "@material-tailwind/react";
import moment from "moment";

export default function ViewRestaurantDrawer({
  closeDrawer,
  open,
  selectedData,
  toggleDrawer,
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (selectedData === null) {
    return null;
  }

  const formatTime = (time) => {
    return moment(time).format("hh:mm A");
  };
  return (
    <Drawer
      overlay={true}
      overlayProps={{
        className: "fixed inset-0 h-full",
      }}
      size={500}
      placement="right"
      open={open}
      onClose={toggleDrawer}
      className="p-4 overflow-y-scroll">
      {/* Close Button */}
      <div className="mb-6 flex items-center justify-between">
        <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </div>

      {/* Background Image and Logo */}
      <figure className="relative h-52 w-full ">
        <img
          className="h-full w-full rounded-xl object-cover object-center"
          src={selectedData?.background_image}
          alt="background image"
        />
        <div className="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
        <figcaption className="absolute top-1/2 z-50 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <Avatar size="lg" src={selectedData?.logo} />
            <Typography variant="lead" color="white" className="font-normal">
              {selectedData?.restaurant_name}
            </Typography>
          </div>
        </figcaption>
      </figure>

      {/* Restaurant Information */}
      <div className="mt-5 space-y-2">
        <Typography variant="h6" color="blue-gray" className="font-normal ">
          Restaurant Information
        </Typography>
        <div className="flex gap-1 bg-[#F2F2F2] border p-3 flex-col rounded-md ">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Restaurant Name:
            </Typography>
            {selectedData?.restaurant_name}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              GST Percentage:
            </Typography>
            {selectedData?.gst_percentage}%
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Total Tables:
            </Typography>
            {selectedData?.total_tables}
          </Typography>

          <Typography variant="paragraph" color="blue-gray" className="font-normal">
            {selectedData?.restaurant_information}
          </Typography>
        </div>

        {/* Owner Information */}
        <Typography variant="h6" color="blue-gray" className="font-normal ">
          Owner Information
        </Typography>
        <div className="bg-[#F2F2F2] border p-3 rounded-md">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Name:
            </Typography>
            {selectedData?.owner_name}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Mobile:
            </Typography>
            {selectedData?.owner_mobile}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Email:
            </Typography>
            {selectedData?.owner_email}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Address:
            </Typography>
            {selectedData?.owner_address}
          </Typography>
        </div>

        {/* Restaurant Contact */}
        <Typography variant="h6" color="black" className="font-normal">
          Restaurant Contact:
        </Typography>
        <div className="bg-[#F2F2F2] border p-3 rounded-md">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Mobile:
            </Typography>

            {selectedData?.restaurant_mobile}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Email:
            </Typography>
            {selectedData?.restaurant_email}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Address:
            </Typography>
            {selectedData?.restaurant_address}
          </Typography>
        </div>

        {/* Additional Info */}
        <Typography variant="h6" color="black" className="font-normal ">
          Additional Information
        </Typography>
        <div className=" bg-[#F2F2F2] border p-3 rounded-md">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Verified:
            </Typography>
            {selectedData?.is_verified ? "Yes" : "No"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Licensed:
            </Typography>
            {selectedData?.licenced ? "Yes" : "No"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Subscription Active:
            </Typography>
            {selectedData?.is_subcription ? "Yes" : "No"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="font-normal flex items-center gap-1">
            <Typography variant="paragraph" color="black" className="font-normal ">
              Is Open:
            </Typography>
            {selectedData?.is_open ? "Yes" : "No"}
          </Typography>
        </div>

        {/* Opening Times */}
        <Typography variant="h6" color="black" className="font-normal ">
          Opening Times:
        </Typography>
        <div className="bg-[#F2F2F2] border p-3 rounded-md">
          {selectedData?.opening_times?.map((dayInfo, index) => (
            <div key={index} className="flex justify-between items-center my-2">
              <Typography variant="paragraph" color="black" className="font-normal">
                {dayInfo?.day}:
              </Typography>
              {dayInfo?.is_open ? (
                <Typography variant="paragraph" color="blue-gray" className="font-normal">
                  Open from {formatTime(dayInfo?.opening_time)} to{" "}
                  {formatTime(dayInfo?.closing_time)}
                </Typography>
              ) : (
                <Typography variant="paragraph" color="red" className="font-normal">
                  Closed
                </Typography>
              )}
            </div>
          ))}
        </div>
        {/* Created At */}
        <Typography variant="h6" color="black" className="font-normal ">
          Created At:
        </Typography>
        <div className="flex gap-1 bg-[#F2F2F2] border p-3 rounded-md items-center">
          <Typography variant="paragraph" color="blue-gray" className="font-normal">
            {moment(selectedData?.created_at).format("DD MMM YYYY, hh:mm A")}
          </Typography>
        </div>
      </div>
    </Drawer>
  );
}
