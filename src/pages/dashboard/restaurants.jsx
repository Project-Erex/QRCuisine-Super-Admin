import React from "react";
import {useEffect, useState} from "react";
import {getAllUsers, getCloudinary, getRestaurantsApis} from "@/apis/restaurants-api";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {ChevronDownIcon, EyeIcon, UserPlusIcon} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  Spinner,
  IconButton,
  Tooltip,
  Select,
  Option,
  MenuHandler,
  Menu,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import ViewRestaurantDrawer from "@/components/restaurant-modal/view-restaurant";
import supabase from "@/configs/supabase";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Verified",
    value: "verified",
  },
  {
    label: "Unverified",
    value: "unverified",
  },
];

const TABLE_HEAD = [
  "Restaurant",
  "GST Percentage",
  "Tables",
  "Owner",
  "Owner Mobile",
  "Owner Email",
  "Verified",
  "Created at",
  "Cloudinary",
  "",
];

export default function Restaurants() {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxItems, setMaxItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxRow, setMaxRow] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [mergedData, setMergedData] = useState(null);
  const [cloudData, setCloudData] = useState([]);

  const fetchData = async () => {
    try {
      const [restaurantsResult, authTableResult] = await Promise.all([
        getRestaurantsApis(currentPage, maxRow, activeTab, searchQuery),
        getAllUsers(),
      ]);

      if (restaurantsResult && authTableResult) {
        const mergedResponse = {
          restaurants: restaurantsResult.data,
          maxItems: restaurantsResult.count || 0,
          authTable: authTableResult,
        };

        console.log("Merged Response:", mergedResponse);

        setMergedData(mergedResponse);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUser = async (restaurant) => {
    try {
      const userId = restaurant.admin_id;
      const isVerified = restaurant.is_verified;

      console.log("Updating user ID:", userId, "with verification status:", isVerified);

      // Update user metadata

      const {data: userData, error: userError} = await supabase.auth.admin.updateUserById(
        userId,
        {
          user_metadata: {
            isVerified,
          },
        },
      );

      if (userError) throw userError;

      // Update restaurant verification status
      let updatedRestaurant;
      if (isVerified) {
        const {data: restaurantData, error: restaurantError} = await supabase
          .from("restaurants")
          .update({is_verified: true})
          .eq("admin_id", userId);

        if (restaurantError) {
          throw restaurantError;
        } else {
          updatedRestaurant = {...restaurant, is_verified: true};
        }
      } else {
        updatedRestaurant = {...restaurant, is_verified: false};
      }

      console.log("User updated:", updatedRestaurant);
      return updatedRestaurant;
    } catch (error) {
      console.error("Error updating user metadata:", error.message);
      throw error;
    }
  };

  const fetchCloudinaryData = async () => {
    try {
      const cloudinaryResult = await getCloudinary();
      if (cloudinaryResult) {
        setCloudData(cloudinaryResult);
      }
    } catch (error) {
      console.error("Error fetching Cloudinary data:", error);
    }
  };
  const handleCloudChange = (restaurantId, cloudId) => {
    console.log(
      "Updating Cloud details for restaurant ID:",
      restaurantId,
      "with Cloud ID:",
      cloudId,
    );

    const selectedCloudItem = cloudData.find((item) => item.id === cloudId);

    if (selectedCloudItem) {
      const {cloud_name, upload_preset} = selectedCloudItem;
      handleCloudinaryChange(restaurantId, cloudId, cloud_name, upload_preset);
    } else {
      console.error("Selected cloud item not found");
    }
  };

  const handleCloudinaryChange = async (
    restaurantId,
    cloudId,
    cloudName,
    uploadPreset,
  ) => {
    try {
      const {data, error} = await supabase
        .from("restaurants")
        .update({
          cloudinary_id: cloudId,
          cloud_name: cloudName,
          upload_preset: uploadPreset,
        })
        .eq("id", restaurantId);
      if (error) {
        console.error("Error updating Cloudinary details:", error.message);
        throw error;
      }

      console.log("Cloudinary details updated successfully:", data);
      fetchData(); // Fetch updated data
    } catch (error) {
      console.error("Failed to update Cloudinary details:", error.message);
    }
  };

  useEffect(() => {
    fetchCloudinaryData();
    fetchData();
  }, [maxRow, currentPage, activeTab, searchQuery]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    console.log("CurrentValue: ", value);
  };
  const totalPages = Math.ceil(maxItems / maxRow);

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
  };
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSelectOrder = (value) => {
    setSelectedData({
      id: value.id,
      created_at: value.created_at,
      restaurant_name: value.restaurant_name,
      background_image: value.background_image,
      admin_id: value.admin_id,
      logo: value.logo,
      restaurant_information: value.restaurant_information,
      is_subcription: value.is_subcription,
      licenced: value.licenced,
      is_open: value.is_open,
      opening_times: value.opening_times,
      gst_percentage: value.gst_percentage,
      owner_name: value.owner_name,
      owner_mobile: value.owner_mobile,
      owner_email: value.owner_email,
      owner_address: value.owner_address,
      restaurant_mobile: value.restaurant_mobile,
      restaurant_email: value.restaurant_email,
      restaurant_address: value.restaurant_address,
      total_tables: value.total_tables,
      is_verified: value.is_verified,
      unique_name: value.unique_name,
      opening_times: value?.opening_times,
    });
    toggleDrawer();
  };

  return (
    <div>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Restaurants
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Restaurants
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="outlined" size="sm">
                view all
              </Button>
              <Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({label, value}) => (
                  <Tab key={value} value={value} onClick={() => handleTabChange(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search by Restaurants"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLoading(true);
                    setCurrentPage(1);
                  }
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0 ">
          {loading ? (
            <div className="flex w-full h-[350px] justify-center items-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody
                className={`${
                  mergedData.restaurants.length === 0 && "h-[300px]"
                } relative w-full `}>
                {mergedData.restaurants.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                      <Typography variant="h6" color="blue-gray" className="font-normal">
                        No Ratings Found
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  mergedData.restaurants.map(
                    (
                      {
                        id,
                        created_at,
                        restaurant_name,
                        logo,
                        gst_percentage,
                        owner_name,
                        owner_mobile,
                        owner_email,
                        owner_address,
                        restaurant_mobile,
                        restaurant_email,
                        restaurant_address,
                        total_tables,
                        is_verified,
                        unique_name,
                        background_image,
                        admin_id,
                        restaurant_information,
                        is_subcription,
                        licenced,
                        is_open,
                        cloudinary_id,
                        opening_times,
                      },
                      index,
                    ) => {
                      const isLast = index === restaurantsData.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className="flex items-center gap-2">
                              <Avatar src={logo} alt={restaurant_name} size="md" />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal">
                                  {restaurant_name}
                                </Typography>
                              </div>
                            </div>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal">
                              {gst_percentage}%
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal">
                              {total_tables}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal">
                              {owner_name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal">
                              {owner_mobile}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal">
                              {owner_email}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Select
                              label="Verification Status"
                              value={is_verified ? "Yes" : "No"}
                              disabled={is_verified}
                              onChange={(value) =>
                                handleUser({
                                  admin_id,
                                  is_verified: value === "Yes",
                                })
                              }>
                              <Option value="Yes">Yes</Option>
                              <Option value="No">No</Option>
                            </Select>
                          </td>

                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal">
                                  {new Date(created_at)
                                    .toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                    .replace(/-/g, " ")}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <Menu size="xs">
                              <MenuHandler>
                                <Chip
                                  icon={<ChevronDownIcon size={20} />}
                                  variant="ghost"
                                  size="md"
                                  color={
                                    cloudinary_id?.title === "primary"
                                      ? "amber"
                                      : cloudinary_id?.title === "secondary"
                                      ? "green"
                                      : "gray"
                                  }
                                  value={cloudinary_id?.title || "Select"}
                                  className="flex justify-center cursor-pointer"
                                />
                              </MenuHandler>
                              <MenuList>
                                {cloudData.map((item, index) => (
                                  <MenuItem
                                    onClick={() => handleCloudChange(id, item.id)}
                                    key={index}>
                                    {item.title}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                          </td>
                          {/* **************************************** */}

                          <td className={classes}>
                            <Tooltip content="View Order">
                              <IconButton
                                onClick={() =>
                                  handleSelectOrder({
                                    id: index,
                                    created_at,
                                    restaurant_name,
                                    logo,
                                    gst_percentage,
                                    owner_name,
                                    owner_mobile,
                                    owner_email,
                                    background_image,
                                    admin_id,
                                    restaurant_information,
                                    is_subcription,
                                    licenced,
                                    is_open,
                                    opening_times,
                                    owner_address,
                                    restaurant_mobile,
                                    restaurant_email,
                                    restaurant_address,
                                    total_tables,
                                    is_verified,
                                    unique_name,
                                  })
                                }
                                variant="text">
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    },
                  )
                )}
              </tbody>
            </table>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex items-center gap-2 mt-4">
            {(() => {
              const pages = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                if (currentPage <= 3) {
                  pages.push(1, 2, 3, 4, "...");
                } else if (currentPage >= totalPages - 2) {
                  pages.push(
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                  );
                } else {
                  pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
                }
              }

              return pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="text-blue-gray-500">...</span>
                  ) : (
                    <IconButton
                      variant={page === currentPage ? "filled" : "text"}
                      disabled={page === currentPage}
                      size="sm"
                      onClick={() => handlePageChange(page)}>
                      {page}
                    </IconButton>
                  )}
                </React.Fragment>
              ));
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="w-24"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="w-24"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ViewRestaurantDrawer
        open={open}
        openDrawer={openDrawer}
        closeDrawer={closeDrawer}
        selectedData={selectedData}
        toggleDrawer={toggleDrawer}
      />
    </div>
  );
}
