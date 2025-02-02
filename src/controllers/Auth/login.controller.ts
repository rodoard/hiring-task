import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { generateToken } from "../../utils/generate";
import { comparePassword } from "../../utils/password";
import httpStatus from "http-status";

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userService.getOneUser({ email });
  
  // Check for invalid email or deleted user
  if (!findUser || findUser.deletedAt) {
    return res.status(httpStatus.UNAUTHORIZED).json({ 
      message: 'Invalid email or password' 
    });
  }
  
  // Check for invalid password
  const compare = await comparePassword(password, findUser.password);
  if (!compare) {
    return res.status(httpStatus.UNAUTHORIZED).json({ 
      message: 'Invalid email or password' 
    });
  }
  
  // Generate token for successful login
  const token = generateToken(findUser.uuid);
  res.status(httpStatus.ACCEPTED).json({ token });
};

export const loginController = errorHandlerWrapper(loginHandler);
