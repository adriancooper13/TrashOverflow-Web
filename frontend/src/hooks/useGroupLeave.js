import axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useAPIErrorChecking } from "./useAPIErrorChecking";

const useGroupLeave = (GlobalContext) => {
  const errCheck = useAPIErrorChecking();
  const { storeJWT } = useContext(GlobalContext);
  const history = useHistory();

  return (group_ID) => {
    axios
      .post("/api/groups/leave", {
        group_ID,
      })
      .then((res) => {
        if (res.data.error !== "") throw res.data.error;
        console.log(res);
        if ("token" in res.data) storeJWT(res.data.token);
        history.push("/groups");
      })
      .catch((err) => errCheck(err));
  };
};

export default useGroupLeave;
