import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/config/api";
import { endpoints } from "../../utils/config/config";

const initialState = {
  user: null,
  loading: false,
  token: null,
  error: null,
};

export const profileDetails = createAsyncThunk(
  "profile/profileDetails",
  async ({ email }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

      console.log("TOKEN:", token);

      const res = await api.post(endpoints.PROFILE_DETAILS,
        { email },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "Fracspace@2024",
          },
        }
      );
//console.log(res?.data,"=======gata=======")
      return res.data;
     
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// export const nearByStays = createAsyncThunk(
//   "profile/nearByStays",
//   async ({ email }, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const storedToken = await AsyncStorage.getItem("mytoken");
//       const rawToken = storedToken;
//       const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

//       console.log("TOKEN:", token);

//       const res = await api.post(endpoints.PROFILE_DETAILS,
//         { email },
//         {
//           headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${token}`,
//             "x-api-key": "Fracspace@2024",
//           },
//         }
//       );
// //console.log(res?.data,"=======gata=======")
//       return res.data;
     
//     } catch (err) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data;
        console.log("USER:", state.user);
      })
      .addCase(profileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("ERROR:", action.payload);
      });
  },
});

export const { logout } = profileSlice.actions;
export default profileSlice.reducer;