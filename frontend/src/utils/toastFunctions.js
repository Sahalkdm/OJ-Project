import { toast } from "react-toastify";

export const handleError = (err) =>
    toast.error(err, {
        position: "bottom-left",
    });
    
export const handleSuccess = (msg) =>
    toast.success(msg, {
        position: "bottom-right",
});
