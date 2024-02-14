import { url } from "../links";

export const modalMiddleware = () => (dispatch) => (action) => {

    if (action.type === 'ui/sendCloseModalMessage') {
        window.parent.postMessage("closeModal", `${url}`);
    }

    return dispatch(action);
};
  