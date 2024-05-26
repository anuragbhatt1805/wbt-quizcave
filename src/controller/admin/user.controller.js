import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { generateToken } from "../../util/TokenGeneration.js";
import { User } from "../../model/User.model.js";
import path from "path";
import { trusted } from "mongoose";

export const RegisterUser = AsyncHandler(async (req, res) => {
    try {
        // if (!req.user){
        //     throw new ApiError(401, "Unauthorized Access");
        // }

        const { name, email, phone, userId, password, designation } = req.body;

        if (!name || !email || !phone || !userId || !password || !designation) {
            throw new ApiError(400, "All fields are required");
        }

        if (req?.files?.profile?.length === 0) {
            throw new ApiError(400, "Profile picture is required");
        }

        const profilePic = path.join("uploads", path.basename(req?.files?.profile[0]?.path));

        const existingUser = await User.findOne({ $or: [{ email }, { userId }] });

        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const newUser = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            userId: userId.trim().toUpperCase(),
            password: password.trim(),
            role: "admin",
            designation: designation.trim(),
            profilePic: profilePic,
        })

        if (!newUser) {
            throw new ApiError(400, "User registration failed");
        }

        const { accessToken, refreshToken } = await generateToken(newUser._id);

        const newUserInfo = await User.findById(newUser._id).select("-password -_id -__v");

        const option = {
            httpOnly: true,
            secure: true,
        }

        return res.status(201)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(201, newUserInfo, "User registered successfully"));

    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const LoginUser = AsyncHandler(async (req, res) => {
    try{

        console.log(req.body)
        const { userId, password } = req.body;

        if (!userId || !password) {
            throw new ApiError(400, "User ID and password are required");
        }

        const user = await User.findOne({ userId:userId.trim() }).select("-__v -accessToken -refreshToken");

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        if (!user.verifyPassword(password)) {
            throw new ApiError(400, "Incorrect password");
        }

        const { accessToken, refreshToken } = await generateToken(user._id);

        const option = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(200, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                userId: user.userId,
                role: user.role,
                designation: user.designation,
                profilePic: user.profilePic,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, "User logged in successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const GetUserInfo = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const user = await User.findById(req.user._id).select("-password -_id -__v -accessToken -refreshToken");

        if (!user) {
            throw new ApiError(400, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Current user information fetched successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});
