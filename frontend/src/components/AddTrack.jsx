import { Button, Modal } from "antd";
import { useState, useRef, useContext } from "react";
import TrackDataInput from "./TrackDataInput";
import { createTrack } from "../api/tracks-api";
import { TracksContext } from "../store/tracks-context";
import useToast from "../hooks/useToast";

export default function AddTrackButton() {
  const { addTrack } = useContext(TracksContext)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();
    const { showMessage, ToastContainer } = useToast()

    function showModal() {
      setIsCreateModalOpen(true)
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
        showMessage('error', 'Error creating track')
        setLoading(false);
      } finally {
        showMessage('success', 'Track created successfully!')
        setTimeout(() => {
          setLoading(false);
          setIsCreateModalOpen(false);
          formRef.current?.resetForm();
        }, 1000);
      }
    }

    function handleCancelCreation() {
      setIsCreateModalOpen(false)
      formRef.current?.resetForm()
    }

  return (
    <>
      <ToastContainer />
      <Modal
        title={<h1 className="text-blue-600 font-medium text-xl">Hey, wanna add new track?</h1>}
        open={isCreateModalOpen}
        onOk={handleCreateTrack}
        onCancel={handleCancelCreation}
        data-testid="confirm-dialog"
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
