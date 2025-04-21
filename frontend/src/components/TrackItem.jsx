import { Tag, Upload, Button, Modal, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useContext } from "react";
import { TracksContext } from "../store/tracks-context";
import { deleteTrack } from "../api/tracks-api";
import TrackDataInput from "./TrackDataInput";
import { validateAudioUpload } from "../utils/validation";
import { uploadTrackAudio } from "../api/tracks-api";

export default function TrackItem(trackData) {
  const { id, title, artist, album, genres, coverImage } = trackData;
  const [isWarningModalOpen, setIsWarningModalOpen] = useState();
  const [loading, setLoading] = useState(false);
  const { handleDeleteTrack } = useContext(TracksContext);
  const [messageApi, contextHolder] = message.useMessage();

  function showMessage(type, content, duration) {
    messageApi.open({
      type: type,
      content: content, 
      duration: duration
    })
  }

  function handleDeleteWarning() {
    setIsWarningModalOpen(true);
  }

  async function handleConfirmDeleting(id) {
    setLoading(true);

    try {
      await deleteTrack(id);
      setLoading(true);
    } catch (error) {
      console.error("Error deleting track:", error.message);
      showMessage('error', 'Error deleting track', 5)
      setLoading(false);
    } finally {
      setTimeout(() => {
        handleDeleteTrack(id);
        setLoading(false);
        setIsWarningModalOpen(false);
        showMessage('success', 'Track deleted successfully', 3)
      }, 1000);
    }
  }

  function handleCancelDeleting() {
    setLoading(false);
    setIsWarningModalOpen(false);
  }

  async function handleUpload({ file, onSuccess, onError }) {
    console.log("Uploading started...");
    const { valid, message: errorMessage } = validateAudioUpload(file);
    if (!valid) {
      console.error("Error validating file:", errorMessage);
      showMessage('error', 'Error validating file', 5)
      onError(new Error(errorMessage));
      return;
    }

    try {
      await uploadTrackAudio(id, file);
      console.log("Uploaded successfully");
      showMessage('success', 'Track uploaded successfully', 3)
      onSuccess("Track uploaded");
    } catch (error) {
      console.error("Error uploading track:", error.message);
      showMessage('error', 'Error uploading track', 5)
      onError(new Error(error.message));
    }
  }

  return (
    <>
      {contextHolder}
      <div
        className="flex flex-row gap-5 max-xl:flex-wrap"
        data-testid={`track-item-${id}`}
      >
        <div className="w-3/4 max-xl:w-full flex items-center gap-5 border-2 p-3 rounded-3xl border-blue-200 bg-blue-50">
          <img
            src={coverImage}
            alt="Track cover image"
            className="w-20 h-20 object-cover rounded-2xl"
          ></img>
          <div className="flex flex-col items-start gap-3">
            <div className="flex gap-5 items-end max-lg:gap-3">
              <h1
                className="text-3xl max-md:text-2xl text-blue-500"
                data-testid="track-item-{id}-title"
              >
                {title}
              </h1>
              <p
                className="text-xl max-md:text-sm max-sm:text-xs font-light text-blue-400"
                data-testid="track-item-{id}-artist"
              >
                {artist}
              </p>
              <p className="text-blue-300 max-lg:text-sm max-sm:text-xs">
                {album}
              </p>
            </div>
            <p>
              {genres.map((genre) => (
                <Tag key={genre} color="blue">
                  {genre}
                </Tag>
              ))}
            </p>
          </div>
        </div>
        <div className="w-1/4 max-xl:w-auto flex items-center gap-3 border-2 p-3 rounded-3xl border-blue-200 bg-blue-50">
          <Upload maxCount={1} customRequest={handleUpload} showUploadList={false}>
            <Button
              color="primary"
              variant="solid"
              icon={<UploadOutlined />}
              style={{ height: 80, borderRadius: 12 }}
              data-testid="upload-track-{id}"
            >
              Upload track
            </Button>
          </Upload>

          <Button
            color="primary"
            variant="dashed"
            className="w-full"
            style={{ height: 80 }}
            data-testid="edit-track-{id}"
          >
            Edit
          </Button>

          <Modal
            title={<h1 className="text-3xl text-red-600">Deleting track</h1>}
            open={isWarningModalOpen}
            onOk={handleConfirmDeleting}
            onCancel={handleCancelDeleting}
            footer={[
              <Button key="back" onClick={handleCancelDeleting}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                color="danger"
                variant="solid"
                onClick={() => handleConfirmDeleting(id)}
                loading={loading}
              >
                Delete
              </Button>,
            ]}
          >
            <p className="text-lg text-red-400">
              Are you sure that you want to delete the track? Deleting a track
              is an irreversible process.
            </p>
          </Modal>

          <Button
            color="danger"
            variant="outlined"
            style={{ height: 60, width: 60, borderRadius: 100 }}
            data-testid="delete-track-{id}"
            onClick={handleDeleteWarning}
          >
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    </>
  );
}

