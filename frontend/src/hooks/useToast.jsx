import { message } from "antd";
import { useMemo } from "react";

export default function useToast() {
    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = useMemo(
      () =>
        (type, content, duration = 5) => {
          const messageContent = (
            <span data-testid={`toast-${type}`}>{content}</span>
          );

          messageApi.open({
            type,
            content: messageContent,
            duration,
          });
        },
      [messageApi]
    );

    const ToastContainer = () => <>{contextHolder}<div data-testid="toast-container"/></>

    return { showMessage, ToastContainer };
} 