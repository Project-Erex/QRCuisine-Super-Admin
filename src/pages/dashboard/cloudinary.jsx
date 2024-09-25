import {ChevronDownIcon, PencilIcon, UserPlusIcon} from "@heroicons/react/24/solid";
import {ArrowDownTrayIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  Spinner,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {getRestaurantsApis} from "@/apis/restaurants-api";
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
  "Cloudinary",
  "Cloud Name",
  "Upload Preset",
  "Storage",
  "",
];

export default function Cloudinary() {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxItems, setMaxItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxRow, setMaxRow] = useState(10);
  const isTesting = false;

  const fetchRestaurantsData = async () => {
    const restaurantResult = await getRestaurantsApis(
      currentPage,
      maxRow,
      activeTab,
      searchQuery,
    );
    if (restaurantResult) {
      console.log("result", restaurantResult.count);
      setRestaurantsData(restaurantResult.data);
      console.log("Response:", restaurantResult);
      setMaxItems(restaurantResult.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isTesting) {
      setRestaurantsData([]);
      setLoading(false);
    } else {
      fetchRestaurantsData();
    }
  }, [maxRow, currentPage, loading, activeTab, searchQuery]);

  const totalPages = Math.ceil(maxItems / maxRow);
  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
  };
  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    console.log("CurrentValue: ", value);
  };
  return (
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
              } relative w-full `}>
              {restaurantsData.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                    <Typography variant="h6" color="blue-gray" className="font-normal">
                      No Cloudinary Credential Found
                    </Typography>
                  </td>
                </tr>
              ) : (
                restaurantsData.map(
                  (
                    {
                      id,
                      created_at,
                      restaurant_name,
                      logo,
                      cloud_name,
                      upload_preset,
                      cloudinary_id,
                      storage,
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
                          <Chip
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
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {cloud_name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {upload_preset}
                          </Typography>
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
        <Button variant="outlined" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" size="sm">
            1
          </IconButton>
          <IconButton variant="text" size="sm">
            2
          </IconButton>
          <IconButton variant="text" size="sm">
            3
          </IconButton>
          <IconButton variant="text" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" size="sm">
            8
          </IconButton>
          <IconButton variant="text" size="sm">
            9
          </IconButton>
          <IconButton variant="text" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
