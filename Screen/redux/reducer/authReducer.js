import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";


const initialState= {
  message: null,
  loading: false,
  token: null,
  statusCode: 0,
  errorMsg: '',
  user: null,
  error: null,
  orderId: '',
  message_type:'',
  register_Details:[],
  userId:'',
  registerSuccess:false
};


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'https://apitest.fracspace.com/api/users/userRegisterationWithoutPassword',
        payload,
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        }
      );
      return data;

    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data?.message,
        });
      }

      return rejectWithValue({
        message: error.message,
      });
    }
  }
);


export const AuthSlice = createSlice({
  name: 'authlice',
  initialState,
  reducers: {
    restoreUserSession: (state, action) => {
      state.token = action.payload.token;
    },
    actionLogout: state => {
      state.token = null;
    },
    logoutActionReducer: state => {
        state.token = null;
     // AsyncStorage.removeItem('access_token');
    },
  },
  extraReducers: builder => {
     builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        ///state.errorStatus = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = action.payload?.success;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
       // state.error = action.payload?.message;
      //  state.errorStatus = action.payload?.status;
      });


  },
});

export const { actionLogout, restoreUserSession,logoutActionReducer} = AuthSlice.actions;

export default AuthSlice.reducer;