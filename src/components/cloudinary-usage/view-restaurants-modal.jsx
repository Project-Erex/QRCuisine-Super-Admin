import React from "react";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
export default function ViewRestaurantsModal({
  open,
  selectedCloudData,
  onClose,
  onToggleExpand,
}) {
  console.log("object", selectedCloudData);

  return (
    <>
      <Drawer
        overlay={true}
        overlayProps={{
          className: "fixed inset-0 h-full",
        }}
        size={500}
        placement="right"
        className="p-4 overflow-y-scroll"
        open={open}
        onClose={onClose}>
        {selectedCloudData && (
          <div className="flex flex-col items-start">
            {/* Close Button */}
            <div className="mb-6 flex items-center justify-between">
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={() => onToggleExpand(selectedCloudData.cloudName)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>

            <Typography variant="lead" color="blue-gray">
              Restaurants Using Cloudinary
            </Typography>

            <Card className="w-full !shadow-none pt-4">
              <List>
                {selectedCloudData.restaurants.map((restaurant, idx) => (
                  <ListItem key={idx}>
                    <ListItemPrefix>
                      <Avatar
                        variant="circular"
                        withBorder={true}
                        color="green"
                        alt="alexander"
                        src={restaurant.logo}
                      />
                    </ListItemPrefix>
                    <div>
                      <Typography variant="paragraph" color="blue-gray">
                        {restaurant.restaurant_name}
                      </Typography>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
        )}
      </Drawer>
    </>
  );
}
