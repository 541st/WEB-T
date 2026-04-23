import { useToast } from "vue-toastification";

const toast = useToast();

export const notify = {
  error: (msg) => toast.error(msg || "Произошла ошибка"),
  success: (msg) => toast.success(msg || "Операция успешна"),
  info: (msg) => toast.info(msg),
  warning: (msg) => toast.warning(msg)
};