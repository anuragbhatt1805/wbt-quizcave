import { ApiError } from "../util/ApiError.js"
import { ApiResponse } from "../util/ApiResponse.js"
import { AsyncHandler } from "../util/AsyncHandler.js"
import { User } from "../model/User.model.js"
import jwt from "jsonwebtoken";

export const auth = AsyncHandler(async (req, res, next) => {
    try{
        // console.log(req?.header);
        console.log(req?.headers);
        const token = req?.headers?.authorization?.replace("Bearer ", "") || req?.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded._id).select("-password -refreshToken -accessToken -__v");

        if (!user) {
            throw new ApiError(401, "Invalid Token Received");
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(`AUTH ERROR: Error during Authentication: ${error}`);
        throw new ApiError(401, "Unable to authenticate");
    }
});