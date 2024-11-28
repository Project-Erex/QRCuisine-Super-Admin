import React, {useEffect, useState} from "react";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  Avatar,
  IconButton,
  Spinner,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import {
  deleteRank,
  getRankingBadgeApis,
  InsertRank,
  updatedRankingBadge,
} from "@/apis/ranking-badge-api";
import RankingEdit from "@/components/ranking-badge-modal/ranking-edit";
import AddRank from "@/components/ranking-badge-modal/add-rank";
import DeleteRank from "@/components/ranking-badge-modal/delete-rank";

export function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openAddRank, setOpenAddRank] = useState(false);
  const [openDeleteRank, setOpenDeleteRank] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState(null);
  const [rankIdToDelete, setRankIdToDelete] = useState(null);

  const handleOpenAddRank = () => setOpenAddRank(!openAddRank);
  const handleOpenDeleteRank = () => setOpenDeleteRank(!openDeleteRank);

  const handleDeleteButtonClick = (id) => {
    setRankIdToDelete(id);
    handleOpenDeleteRank();
  };
  const handleOpen = (ranking = null) => {
    setSelectedRanking(ranking);
    setOpen(!open);
  };
  const fatchRankingData = async () => {
    try {
      const rankingResult = await getRankingBadgeApis();
      if (rankingResult) {
        console.log("first", rankingResult);
        setRankings(rankingResult);
      }
    } catch (error) {
      console.error("Error fetching Cloudinary data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async (updatedData) => {
    setLoading(true);
    try {
      await updatedRankingBadge(selectedRanking.id, updatedData);
      handleOpen();
      fatchRankingData();
    } catch (error) {
      console.error("Error updating ranking badge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRank = async (newRankData) => {
    setLoading(true);
    try {
      await InsertRank(newRankData);
      handleOpenAddRank();
      fatchRankingData();
    } catch (error) {
      console.error("Error inserting ranking badge:", error);
    } finally {
      setLoading(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await deleteRank({id: rankIdToDelete});
    } catch (error) {
      console.error("Error deleting ranking badge:", error);
    } finally {
      setLoading(false);
      handleOpenDeleteRank();
      fatchRankingData();
    }
  };

  useEffect(() => {
    fatchRankingData();
  }, []);

  const TABLE_HEAD = ["Tier", "Greater Than", "Less Than", "Color", "sorting", ""];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Ranking Badge
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all Ranking Badges
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <Button
                onClick={handleOpenAddRank}
                className="flex items-center gap-3"
                size="sm">
                Add Rank
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
            <table className="w-full min-w-max table-auto text-left">
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
              <tbody>
                {rankings?.data?.map(
                  (
                    {title, greater_than, less_than, image, sorting, color, id},
                    index,
                  ) => {
                    const isLast = index === rankings.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={image}
                              alt={title}
                              size="md"
                              className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                            />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold">
                              {title}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {greater_than}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {less_than}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Chip
                            value={color}
                            size="lg"
                            style={{backgroundColor: color}}
                            className="flex items-center justify-center"
                          />
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            {sorting}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit User">
                            <IconButton
                              onClick={() =>
                                handleOpen({
                                  id,
                                  title,
                                  greater_than,
                                  less_than,
                                  image,
                                  color,
                                  sorting,
                                })
                              }
                              variant="text">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete User">
                            <IconButton
                              onClick={() => handleDeleteButtonClick(id)}
                              variant="text">
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
      <RankingEdit
        open={open}
        handleOpen={handleOpen}
        loading={loading}
        selectedRanking={selectedRanking}
        onConfirm={handleConfirmUpdate}
      />

      <AddRank
        loading={loading}
        open={openAddRank}
        handleOpenAddRank={handleOpenAddRank}
        onAddRank={handleAddRank}
      />
      <DeleteRank
        open={openDeleteRank}
        handleSubmit={handleSubmit}
        loading={loading}
        handleOpen={handleOpenDeleteRank}
      />
    </div>
  );
}

export default Ranking;
