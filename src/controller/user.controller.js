import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { AsyncHandler } from "../util/AsyncHandler.js";

export const registerStudent = AsyncHandler(async (req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(400, error.message);
    }
})