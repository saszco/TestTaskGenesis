import { Tag, Upload, Button, Modal, message, Checkbox } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useContext, useRef } from "react";
import { TracksContext } from "../store/tracks-context";
import {
  deleteTrack,
  updateTrackData,
  deleteTrackAudio,
} from "../api/tracks-api";
import TrackDataInput from "./TrackDataInput";
import { validateAudioFormat, validateAudioSize } from "../utils/validation";
import { uploadTrackAudio } from "../api/tracks-api";
import useToast from "../hooks/useToast";

export default function TrackItem(trackData) {
  const { id, title, artist, album, genres, coverImage, audioFile, onPlay } =
    trackData;
  const { handleDeleteTrack, updateTrack } = useContext(TracksContext);
  const [loading, setLoading] = useState(false);
  const audioUrl = `http://localhost:8000/api/files/${audioFile}`;
  const audioRef = useRef(null);
  const editFormRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState({
    editing: false,
    deletingAudio: false,
    deletingTrack: false,
    deletingSelectedTracks: false,
  });
  const { showMessage, ToastContainer } = useToast();

  async function handleConfirmDeleting(id) {
    setLoading(true);
    try {
      await deleteTrack(id);
    } catch (error) {
      showMessage("error", "Error deleting track");
      console.error("Error deleting track:", error.message);
      setLoading(false);
    } finally {
      showMessage("success", "Track deleted successfully");
      setTimeout(() => {
        handleDeleteTrack(id);
        setLoading(false);
        setIsModalOpen((prev) => ({ ...prev, deletingTrack: false }));
      }, 1000);
    }
  }

  async function handleUpload({ file, onSuccess, onError }) {
    if (audioFile) {
      console.error("Audio file already uploaded");
      showMessage(
        "warning",
        'Audio file already uploaded. Click "Edit" if you want to change'
      );
      return;
    }

    if (!validateAudioFormat(file)) {
      console.error("Incompatible file format. Only mp3 and wav are supported");
      showMessage(
        "error",
        "Incompatible file format. Provide MP3 or WAV file"
      );
      onError("Incompatible file format", file);
      return;
    }

    if (!validateAudioSize(file)) {
      console.error("File size is too large. Maximum file size is 10MB");
      showMessage(
        "error",
        "File size is too large. Maximum file size is 10 MB"
      );
      onError("File size is too large", file);
      return;
    }

    if (!audioFile) {
      try {
        const data = await uploadTrackAudio(id, file);
        updateTrack(id, { audioFile: data?.audioFile });
      } catch (error) {
        console.error("Error uploading track:", error.message);
        showMessage("error", "Error uploading track");
        onError("Error uploading track", file);
      }finally{
        onSuccess("ok", file);
        showMessage("success", "Track uploaded successfully");
        console.log("Uploaded successfully");
      }
    }
  }

  function handlePlay() {
    if (onPlay && audioRef.current) {
      onPlay(audioRef.current);
    }
  }

  async function handleEditingTrack() {
    const editedTrackData = await editFormRef.current?.getFormData();

    const isChanged =
      editedTrackData?.title !== title ||
      editedTrackData?.artist !== artist ||
      editedTrackData?.album !== album ||
      editedTrackData?.coverImage !== coverImage ||
      editedTrackData?.genres !== genres;

    if (!isChanged) {
      showMessage("warning", "No changes were made to the track data");
      setTimeout(() => {
        setIsModalOpen((prev) => ({ ...prev, editing: false }));
      }, 2500)
      return;
    }

    if (!editedTrackData) {
      return;
    }

    setLoading(true);

    try {
      const editedTrack = await updateTrackData(id, editedTrackData);
      updateTrack(id, editedTrack);
    } catch (error) {
      console.error("Error updating track");
      setLoading(false);
      showMessage("error", "Error updating track");
    } finally {
      showMessage("success", "Track data edited successfully");
      setTimeout(() => {
        setLoading(false);
        setIsModalOpen((prev) => ({ ...prev, editing: false }));
      }, 1000);
    }
  }

  async function handleAudioDeleting(id) {
    setLoading(true);
    try {
      await deleteTrackAudio(id);
    } catch (error) {
      console.error("Error deleting audio", error.message);
      showMessage("error", "Error deleting audio");
    } finally {
      showMessage("success", "Audio deleted successfully");
      setTimeout(() => {
        setLoading(false);
        setIsModalOpen((prev) => ({ ...prev, deletingAudio: false }));
        updateTrack(id, { audioFile: null });
      }, 1000);
    }
  }

  function handleCloseModal() {
    setIsModalOpen({
      editing: false,
      deletingAudio: false,
      deletingTrack: false,
      deletingSelectedTracks: false,
    });
    setLoading(false);
  }

  return (
    <>
      {<ToastContainer />}
      <div
        className="flex flex-row gap-5 max-xl:flex-wrap"
        data-testid={`track-item-${id}`}
      >
        <div className="w-3/4 max-xl:w-full flex items-center gap-5 border-2 p-3 rounded-3xl border-blue-300 bg-stone-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
          <div className="flex flex-row items-center justify-between w-full flex-wrap">
            <div className="flex items-center gap-5">
              <img
                src={coverImage}
                alt="Track cover image"
                className="w-20 h-20 object-cover rounded-2xl"
              />
              <div className="flex flex-col items-start gap-3">
                <div className="flex gap-5 items-end max-lg:gap-3">
                  <h1
                    className="text-3xl max-md:text-2xl max-sm:text-lg text-blue-500 m-0"
                    data-testid={`track-item-${id}-title`}
                  >
                    {title}
                  </h1>
                  <p
                    className="text-xl max-md:text-sm max-sm:text-xs font-light text-blue-400"
                    data-testid={`track-item-${id}-artist`}
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
            {audioFile ? (
              <audio
                controls
                src={audioUrl}
                ref={audioRef}
                onPlay={handlePlay}
                data-testid={`audio-player-${id}`}
              ></audio>
            ) : (
              <p className="mr-8 max-md:mt-4 text-blue-100">
                Click upload track button
              </p>
            )}
          </div>
        </div>
        <div className="w-1/4 max-xl:w-auto flex items-center gap-3 border-2 p-3 rounded-3xl border-blue-200 bg-blue-50">
          <Modal
            title={<h1 className="text-3xl text-red-600">Deleting audio</h1>}
            open={isModalOpen.deletingAudio}
            onOk={() => handleAudioDeleting(id)}
            onCancel={handleCloseModal}
            data-testid="confirm-dialog"
            footer={[
              <Button
                key="back"
                onClick={handleCloseModal}
                data-testid="cancel-delete"
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                color="danger"
                variant="solid"
                onClick={() => handleAudioDeleting(id)}
                loading={loading}
                data-testid="confirm-delete"
              >
                Delete audio
              </Button>,
            ]}
          >
            <p className="text-lg text-red-400">
              Are you sure that you want to delete the audio? Deleting an audio
              is an irreversible process. But then you can still upload new
              track
            </p>
          </Modal>

          {audioFile ? (
            <Button
              color="danger"
              variant="dashed"
              icon={<DeleteOutlined />}
              style={{ height: 80, borderRadius: 12 }}
              onClick={() =>
                setIsModalOpen((prev) => ({ ...prev, deletingAudio: true }))
              }
            >
              Delete audio
            </Button>
          ) : (
            <Upload
              maxCount={1}
              customRequest={handleUpload}
              showUploadList={false}
            >
              <Button
                color="primary"
                variant="solid"
                icon={<UploadOutlined />}
                style={{ height: 80, borderRadius: 12 }}
                data-testid={`upload-track-${id}`}
              >
                Upload track
              </Button>
            </Upload>
          )}

          <Modal
            title={
              <h1 className="text-blue-600 font-medium text-xl">
                Hey, wanna edit your track?
              </h1>
            }
            open={isModalOpen.editing}
            onOk={handleEditingTrack}
            onCancel={handleCloseModal}
            data-testid="confirm-dialog"
            footer={[
              <Button key="back" onClick={handleCloseModal}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleEditingTrack}
                loading={loading}
              >
                Edit a track
              </Button>,
            ]}
          >
            <TrackDataInput
              isEditing={isModalOpen.editing}
              trackId={id}
              ref={editFormRef}
              key={id}
            />
          </Modal>

          <Button
            color="primary"
            variant="dashed"
            className="w-full"
            style={{ height: 80 }}
            data-testid={`edit-track-${id}`}
            onClick={() =>
              setIsModalOpen((prev) => ({ ...prev, editing: true }))
            }
          >
            Edit
          </Button>

          <Modal
            title={<h1 className="text-3xl text-red-600">Deleting track</h1>}
            open={isModalOpen.deletingTrack}
            onOk={() => handleConfirmDeleting(id)}
            onCancel={handleCloseModal}
            data-testid="confirm-dialog"
            footer={[
              <Button
                key="back"
                onClick={handleCloseModal}
                data-testid="cancel-delete"
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                color="danger"
                variant="solid"
                onClick={() => handleConfirmDeleting(id)}
                loading={loading}
                data-testid="confirm-delete"
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
            data-testid={`delete-track-${id}`}
            onClick={() =>
              setIsModalOpen((prev) => ({ ...prev, deletingTrack: true }))
            }
          >
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    </>
  );
}
