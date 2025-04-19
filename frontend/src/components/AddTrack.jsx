import { Button, Modal, Alert } from "antd";
import { useState, useRef, useContext } from "react";
import TrackDataInput from "./TrackDataInput";
import { createTrack } from "../api/tracks-api";
import { TracksContext } from "../store/tracks-context";

export default function AddTrackButton() {
  const { addTrack } = useContext(TracksContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    function showModal() {
      setIsModalOpen(true)
    }

    async function handleCreateTrack(){
      const trackData = await formRef.current?.getFormData();

      if (!trackData) {
        return;
      }

      console.log(trackData);

      setLoading(true);

      try {
        const createdTrack = await createTrack(trackData);
        setTimeout(() => {
          addTrack(createdTrack)
        }, 1000)
        setLoading(true);
      } catch (error) {
        console.error("Error creating track: ", error.message);
        setLoading(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setIsModalOpen(false);
          formRef.current?.resetForm();
        }, 1000);
      }
    }

    function handleCancelCreation() {
      setIsModalOpen(false)
      formRef.current?.resetForm()
    }

  return (
    <>
      <Modal
        title={<h1 className="text-blue-600 font-medium text-xl">Hey, add your track, bro!</h1>}
        open={isModalOpen}
        onOk={handleCreateTrack}
        onCancel={handleCancelCreation}
        footer={[
          <Button key="back" onClick={handleCancelCreation}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleCreateTrack} loading={loading} data-testid="submit-button">+ Add new track</Button>
        ]}
      >
        <TrackDataInput ref={formRef}/>
      </Modal>
      <Button
        onClick={showModal}
        color="primary"
        variant="solid"
        size="large"
        data-testid="create-track-button"
      >
        + Create new track
      </Button>
    </>
  );
}
