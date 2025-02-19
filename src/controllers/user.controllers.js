import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { User } from "../models/user.models";
import uploadOnCloudinary from "../utils/cloudinary";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  //validation
  if (
    [fullName, email, username, password].some((fields) => {
      fields?.trim === "";
    })
  ) {
    throw new ApiError(400, "fields required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) throw new ApiError(409, "user already exist");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "avatar file missing");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage = "";
  if (coverLocalPath) coverImage = await uploadOnCloudinary(coverLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLoweCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while regestring user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registred done!"));
});

export { registerUser };
