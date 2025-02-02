import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { encryptPassword } from "../../utils/encrypt";
import httpStatus from "http-status";

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;
  
  const hashPassword = await encryptPassword(password);
  const user = await userService.createUser({
    username,
    email,
    password: hashPassword,
  });
  
  res.status(httpStatus.CREATED).json({ user });
};

export const registerController = errorHandlerWrapper(registerHandler);
