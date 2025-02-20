import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //1. get user details from frontend -- req.body
  //2. validations
  //3. check if user is alreadt exist - username, email
  //4. check for image and avatar
  //5. upload them to cloudinary
  //6. creat user object - create entry in db
  //7. remove password and refresh token field from response
  //8. check for user creation
  //9. retuen response

  // 1.
  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);

  // 2.
  if (
    [fullName, email, username, password].some((items) => items?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!!");
  }

  // 3.
  const existedUser = User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new ApiError(409, "user already exist!!!");

  // 4.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "avatar file is required");

  // 5.
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "avatar file is required");

  // 6.
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 7 & 8.
  const createdUser = await User.findById(user._id).select(
    // to remove password and refreshToken
    "-password --refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "somthing went wrong while registring user");

  // 9.
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registed successfully"));
});

export default registerUser;
