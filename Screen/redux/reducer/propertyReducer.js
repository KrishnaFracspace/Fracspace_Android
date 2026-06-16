import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  newUpdates: [],
  newUpdatesLoading: false,
  newUpdatesError: null,
  PropertyDetailsById:{},
  upComingProjects:[],
  nearByStays:[],
  referralCode:'',
  shareLink:'',
  referralLinkfront:"",
  referralData:{},
  altairaPromoData:{}
};

export const fetchNewUpdates = createAsyncThunk(
  'home/fetchNewUpdates',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/users/getNewUpdates',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, // ✅ token added
           },
        },
      );
   
      return data;
    } catch (error) {
      console.log('NEW UPDATES API ERROR:', error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const profileDetailsById = createAsyncThunk(
  "profileDetailsById",
  async ({ id }, { rejectWithValue, getState }) => {
  //  console.log("reudc===========")
    try {
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

    //  console.log("TOKEN:", token);
 //console.log("api===========",`${endpoints.PROFILEDETAILS_BYID}/${id}`)
    const res = await axios.get(`https://apitest.fracspace.com/api/users/getPropertyById/${id}`,
  {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": "Fracspace@2024",
    },
  }
);
//console.log(res.data.property,"=======gata=======")
      return res.data.property;
     
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const upComingProjectApi = createAsyncThunk(
  'home/upComingProjectApi',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/v1/interiorConstruction/getUpcomingProjects',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, // ✅ token added
           },
        },
      );
   
      return data;
    } catch (error) {
      console.log('NEW UPDATES API ERROR:', error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const nearByStaysApi = createAsyncThunk(
  'property/nearByStaysApi',
  async (_, { rejectWithValue }) => {
    try {
      // const payload = {
      //   email: email, // no need for JSON.stringify
      // };
      const response = await axios.post(
        'https://apitest.fracspace.com/api/v1/travel/elasticHotelSearch',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'Fracspace@2024',
          },
        }
      );
      //console.log('API RESPONSE DATA:', response.data);
      // ✅ return only API data
      return response.data;
    } catch (error) {
      console.log('API ERROR:', error?.response?.data || error.message);
      return rejectWithValue(
        error?.response?.data || 'Something went wrong'
      );
    }
  }
);


export const refrerLink = createAsyncThunk(
  'property/refrerLink',
  async (_, {rejectWithValue}) => {
       const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");
    try {
      const {data} = await axios.get(
        'https://apitest.fracspace.com/api/referral/me',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': 'Fracspace@2024',
             Authorization: `Bearer ${token}`, 
           },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);


export const altairaPropertyPromo = createAsyncThunk("altairaPropertyPromo",
  async (_, { rejectWithValue, getState }) => {
    try {
      const storedToken = await AsyncStorage.getItem("mytoken");
      const rawToken = storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

    const res = await axios.get(`https://apitest.fracspace.com/api/altaira/promo`,
  {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": "Fracspace@2024",
    },
  }
);
  console.log(res,"=====res=====")
      return res.data;
     
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const propertySlice = createSlice({
  name: 'propertySlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNewUpdates.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(fetchNewUpdates.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdates = action.payload.updates;
       // console.log(state.newUpdates,"===new")
      })
      .addCase(fetchNewUpdates.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });

      builder
      .addCase(profileDetailsById.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(profileDetailsById.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.PropertyDetailsById = action.payload
     //   console.log(state.PropertyDetailsById,"===new")
      })
      .addCase(profileDetailsById.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });

      builder
      .addCase(upComingProjectApi.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(upComingProjectApi.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.upComingProjects = action.payload?.data
        //console.log( state.upComingProjects,"===new")
      })
      .addCase(upComingProjectApi.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });

       builder
      .addCase(nearByStaysApi.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(nearByStaysApi.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.nearByStays = action.payload?.hotels
       // console.log( state.nearByStays,"===state.nearByStays===")
      })
      .addCase(nearByStaysApi.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });


      builder
      .addCase(refrerLink.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(refrerLink.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.referralCode = action.payload?.data?.referralCode;
        state.shareLink = action.payload?.data?.shareLinkBase;
        state.referralData = action.payload?.data
        state.referralLinkfront = `${action.payload?.data?.shareLinkBase}?code=${ action.payload?.data?.referralCode}`;
        console.log( state.shareLink,state.referralCode,"====", state.referralLinkfront)
      })
      .addCase(refrerLink.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
         builder
      .addCase(altairaPropertyPromo.pending, state => {
        state.newUpdatesLoading = true;
        state.newUpdatesError = null;
      })
      .addCase(altairaPropertyPromo.fulfilled, (state, action) => {
        state.newUpdatesLoading = false;
        state.altairaPromoData = action.payload.data;
        console.log(state.altairaPromoData,"=========promo===")
      }) 
      .addCase(altairaPropertyPromo.rejected, (state, action) => {
        state.newUpdatesLoading = false;
        state.newUpdatesError = action.payload;
      });
  },
});

export default propertySlice.reducer;