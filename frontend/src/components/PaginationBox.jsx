import { Button } from "antd";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { TracksContext } from "../store/tracks-context";

export default function PaginationBox({ totalPages }) {
  const { currentPage, setCurrentPage, tracks } = useContext(TracksContext) 

  function handlePageChange(action) {
    switch (action) {
      case "next":
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
        break;
      case "previous":
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
        break;
    }
  }

  return (
    <>
      {tracks.data?.length > 0 && (
        <div
          className="flex justify-center items-center gap-2 mt-8"
          data-testid="pagination"
        >
          <Button
            color="primary"
            variant="outlined"
            icon={<DoubleLeftOutlined />}
            disabled={currentPage === 1}
            onClick={() => handlePageChange("previous")}
            data-testid="pagination-prev"
          >
            Previous tracks
          </Button>
          <p className="text-md text-blue-300 w-28 text-center">
            Page <span className="text-blue-400">{currentPage}</span>/
            {totalPages}
          </p>
          <Button
            color="primary"
            variant="solid"
            icon={<DoubleRightOutlined />}
            iconPosition="end"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
            data-testid="pagination-next"
          >
            Load next tracks
          </Button>
        </div>
      )}
    </>
  );
}
