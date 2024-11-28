import {Fragment, useEffect, useState} from "react";
import {CloudIcon, EyeDropperIcon, EyeIcon} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  Spinner,
  Progress,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import {getCloudinaryApis} from "@/apis/cloudinary-apis";
// import CryptoJS from "crypto-js";
import Cloudinaryinsert from "@/components/cloudinary-usage/Cloudinary-insert";
import ViewRestaurantsModal from "@/components/cloudinary-usage/view-restaurants-modal";

const TABLE_HEAD = [
  "Cloudinary",
  "Cloud Name",
  "Upload Preset",
  "Upgrade Plan",
  "Storage",
  "",
];

export default function Cloudinary() {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isTesting = false;
  const [data, setData] = useState([]);
  const [expandedClouds, setExpandedClouds] = useState({});
  const [selectedCloudData, setSelectedCloudData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const fetchRestaurantsData = async () => {
    const restaurantResult = await getCloudinaryApis();
    if (restaurantResult) {
      console.log("result", restaurantResult.count);
      setRestaurantsData(restaurantResult.data);
    }
  };

  useEffect(() => {
    if (isTesting) {
      setRestaurantsData([]);
      setLoading(false);
    } else {
      fetchRestaurantsData();
    }
  }, [loading]);

  const getUsageStats = async (cloudName, apiKey, apiSecret) => {
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeWFnbHZ4dXppcWZjeHd0eW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3Mjc3OTQsImV4cCI6MjA0MjMwMzc5NH0.NCYQ-48zeXzqSeeAsGS_voi5T8LdONE9NXxdvIxOrYU";

    try {
      const response = await fetch(
        `https://icyaglvxuziqfcxwtymo.supabase.co/functions/v1/cloud-function?cloudName=${cloudName}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${supabaseKey}`,
          },
        },
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching usage statistics:", error);
    }
  };
  useEffect(() => {
    if (restaurantsData.length > 0) {
      cloudinaryData();
    }
  }, [restaurantsData]);

  const cloudinaryData = async () => {
    const accData = await Promise.all(
      restaurantsData.map(async (item) => {
        const cloudinary = item?.cloudinary_id;
        const data = await getUsageStats(
          cloudinary?.cloud_name,
          cloudinary?.apiKey,
          cloudinary?.apiSecret,
        );
        return {
          ...item,
          usages: data,
        };
      }),
    );

    if (accData.length > 0) {
      // Filter data by unique cloud_name
      const filteredData = accData.reduce((acc, item) => {
        const cloudName = item.cloud_name;
        if (!acc[cloudName]) {
          acc[cloudName] = [];
        }
        acc[cloudName].push(item);
        return acc;
      }, {});

      setData(filteredData); // Update the state with filtered data
      console.log("Response:", filteredData);
    }

    setLoading(false);
  };

  const toggleExpand = (cloudName, restaurants) => {
    if (expandedClouds[cloudName]) {
      // If the drawer is open for this cloud, close it
      setOpenDrawer(false);
      setSelectedCloudData(null);
    } else {
      setOpenDrawer(true);
      setSelectedCloudData({cloudName, restaurants});
    }

    setExpandedClouds((prev) => ({
      ...prev,
      [cloudName]: !prev[cloudName],
    }));
  };

  // Close drawer
  const isCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedCloudData(null);
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  console.log("selectedCloudData", selectedCloudData);

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Cloudinary
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Cloudinary accounts
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button onClick={handleOpen} className="flex items-center gap-3" size="sm">
                <CloudIcon strokeWidth={2} className="h-4 w-4" />
                Add Cloudinary A/C
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
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
                  restaurantsData.length === 0 && "h-[300px]"
                } relative w-full`}>
                {Object.keys(data).length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                      <Typography variant="h6" color="blue-gray" className="font-normal">
                        No Cloudinary Credential Found
                      </Typography>
                    </td>
                  </tr>
                ) : (
                  Object.keys(data).map((cloudName, index) => {
                    const restaurants = data[cloudName];
                    const isExpanded = expandedClouds[cloudName];
                    const showMore = restaurants.length > 1 && !isExpanded;

                    return (
                      <Fragment key={cloudName}>
                        {restaurants.slice(0, 1).map((restaurant, idx) => {
                          const isLast = idx === restaurants.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";
                          const {
                            restaurant_name,
                            cloud_name,
                            upload_preset,
                            cloudinary_id,
                            usages,
                          } = restaurant;

                          return (
                            <tr key={restaurant.id}>
                              <td className={classes}>
                                <Chip
                                  variant="filled"
                                  size="lg"
                                  icon={<CloudIcon />}
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
                              </td>
                              <td className={classes}>
                                <Typography color="blue-gray" variant="paragraph">
                                  {cloud_name}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography color="blue-gray" variant="paragraph">
                                  {upload_preset}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Chip
                                  variant="outlined"
                                  size="lg"
                                  // color={usages?.plan ? "indigo" : "green"}
                                  color={
                                    usages?.plan === "Free"
                                      ? "amber"
                                      : usages?.plan === "Paid"
                                      ? "green"
                                      : "gray"
                                  }
                                  value={usages?.plan || "N/A"}
                                  className="flex justify-center cursor-pointer"
                                />
                              </td>
                              <td className={classes}>
                                <div className="mb-2 flex items-center justify-between gap-4">
                                  <Typography color="blue-gray" variant="h6">
                                    Storage Usage
                                  </Typography>
                                  <Typography color="blue-gray" variant="h6">
                                    {usages?.credits?.used_percent || 0}%
                                  </Typography>
                                </div>
                                <Progress value={usages?.credits?.used_percent} />
                              </td>

                              {showMore && (
                                <td className={classes}>
                                  <IconButton
                                    variant="text"
                                    onClick={() => toggleExpand(cloudName, restaurants)}>
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
      <ViewRestaurantsModal
        open={openDrawer}
        selectedCloudData={selectedCloudData}
        onClose={isCloseDrawer}
        onToggleExpand={toggleExpand}
      />
      <Cloudinaryinsert open={open} setOpen={setOpen} handleOpen={handleOpen} />
    </>
  );
}
