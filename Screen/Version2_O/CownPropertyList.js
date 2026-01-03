import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions, Modal, Animated } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/Feather';
import Icc from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { DisLike, Like, LikeData } from '../Services/UserApi';
import { AppContext } from '../Context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CownPropertyList(props) {
    const [propDetails, setPropDetails] = useState(props.route.params.details);
      const { globalState, setGlobalState } = useContext(AppContext);
    const [likedProperty, setLikedProperty] = useState([]);
    const [propertyType, setPropertyType] = useState('');
    const [location, setLocation] = useState('');
    const [apartment, setApartment] = useState('');
    const [categories, setCategories] = useState('All')

    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    const [filterBy, setFilterBy] = useState('Property Type');
    const defaultRange = [500000, 3000000];
    const [priceRange, setPriceRange] = useState(defaultRange);
    const [coupons, setCoupons] = useState('');
    const [visible, setVisible] = useState(false);
    const [like, setLike] = useState([]);
    const scaleAnimation = useRef({}).current;

    useEffect(() => {
        fetchLikedProperty();
    }, []);

    const couponsData = [
        {
            cou : 'Frac',
            price: '₹10,000/-'
        },
        {
            cou : '2 Fracs',
            price: '₹15,000/-'
        }
    ]

    const fetchLikedProperty = async () => {
        let payload = JSON.stringify({ email :globalState?.userEmail, });
        try {
            let {data : res} = await LikeData(payload);
            const likeProp = res?.properties.map(item => item._id);
            // console.log("Likes: ",likeProp)
            setLikedProperty(likeProp);
        } catch (error) {
            console.error("Error in Fetching Liked Hotels: ",error);
        }
    };

    const handleRemoveLike = async (propId) => {
        let payload = JSON.stringify(
            {
                email : globalState?.userEmail,
                propertyId: propId
            }
        );
        try {
            let {data : res} = await DisLike(payload);
          //  console.log("Response: ",res);
        } catch (error) {
            console.error("Error in Removing Liked Prop: ",error);
        }
    }

    const handleLike = async (propId) => {
        let payload = JSON.stringify(
            {
                 email : globalState?.userEmail,
                propertyId: propId
            }
        );
        try {
            let {data : res} = await Like(payload);
            console.log("Response: ",res);
        } catch (error) {
            console.error("Error in Liking Property: ",error);
        }
    }

    const toggleLike = (item) => {
        setLike((prevSelected) => 
        prevSelected.includes(item)
            ? prevSelected.filter((selected) => selected !== item)
            : [...prevSelected, item]
        );
    };

    const triggerScaleAnimation = (itemName) => {
        if(!scaleAnimation[itemName]) {
            scaleAnimation[itemName] = new Animated.Value(1);
        }

        Animated.sequence([
            Animated.timing(scaleAnimation[itemName], {
                toValue: 1.5,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation[itemName], {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }

    const cityMap = {};
    const typeMap = {};

    propDetails?.forEach(item => {
        const city = item.city?.trim().toLowerCase();
        if (city) {
            cityMap[city] = (cityMap[city] || { name: item.city, count: 0 });
            cityMap[city].count += 1;
        }
    });

    propDetails?.forEach(item => {
        const type = item.P_Type?.trim().toLowerCase();
        if(type) {
            typeMap[type] = (typeMap[type] || { name: item.P_Type, count: 0 });
            typeMap[type].count += 1;
        }
    })

    const uniqueCities = Object.values(cityMap);
    const uniqueTypes = Object.values(typeMap);
  return (
     <SafeAreaView style={{flex:1,backgroundColor:'#FAFAFA'}}>
        <ScrollView>
            <View style={{padding:20,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#0000001A',borderBottomWidth:1,paddingTop:40}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CownHome');
                }} style={{backgroundColor:'#FFFFFF'}}>
                    <Icc name={'chevron-left'} size={20} color={'#000000'}/>
                </TouchableOpacity>
                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#191D31'}}>Property Listing</Text>
                <View></View>
            </View>

            <View style={{padding:20,paddingBottom:80}}>
                <View style={{flexDirection:'row',flex:1}}>
                    <View style={{borderColor:'#0000001A',flex:1,borderWidth:1,borderRadius:30,paddingHorizontal:15,height:45,flexDirection:'row',alignItems:'center',marginRight:15}}>
                        <Ic name={'search'} size={20} color={'#00000099'}/>
                        <TextInput
                            placeholder='Search'
                            placeholderTextColor={'#00000099'}
                            style={{marginLeft:10,}}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        setVisible(!visible);
                    }} style={{borderColor:'#0000001A',borderWidth:1,alignItems:'center',justifyContent:'center',borderRadius:30,padding:12}}>
                        <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Filter1.png'}} style={{width:20,height:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{marginVertical:20}}>
                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15,color:'#191D31'}}>Categories</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => {
                        setCategories('All');
                    }} style={{backgroundColor:categories=='All'?'#0F1130':'#FFFFFF',borderColor:categories=='All'?'':'#0061FF1A',borderWidth:1,borderRadius:20,padding:8,paddingHorizontal:20}}>
                        <Text style={{fontFamily:categories=='All'?'WorkSans-SemiBold':'WorkSans-Regular',fontSize:12,color:categories=='All'?'#FFFFFF':'#191D31'}}>All</Text>
                    </TouchableOpacity>

                    {propertyType == '' ?
                        <View></View> :
                        <TouchableOpacity onPress={() => {
                            // setCategories('Apartment');
                        }} style={{borderColor:categories=='Apartment'?'':'#0061FF1A',borderWidth:1,padding:8,paddingHorizontal:20,borderRadius:20,marginLeft:15,backgroundColor:categories=='Apartment'?'#0F1130':'#FFFFFF'}}>
                            <Text style={{fontFamily:categories=='Apartment'?'WorkSans-SemiBold':'WorkSans-Regular',fontSize:12,color:categories=='Apartment'?'#FFFFFF':'#191D31'}}>{propertyType}</Text>
                        </TouchableOpacity>
                    }
                    {(priceRange[0] === defaultRange[0] && priceRange[1] === defaultRange[1])  ?
                        <View></View> :
                        <TouchableOpacity style={{borderColor:'#0061FF1A',borderRadius:20,padding:8,paddingHorizontal:20,borderWidth:1,marginLeft:15,backgroundColor:'#FFFFFF'}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#191D31'}}>₹{priceRange[0]/1000}K - ₹{priceRange[1]/1000}K</Text>
                        </TouchableOpacity>
                    }

                    {location == '' ?
                        <View></View> :
                        <TouchableOpacity style={{borderColor:'#0061FF1A',borderRadius:20,padding:8,paddingHorizontal:20,borderWidth:1,marginLeft:15,backgroundColor:'#FFFFFF'}}>
                            <Text style={{fontFamily:'WorkSans-Regular',fontSize:12,color:'#191D31'}}>{location}</Text>
                        </TouchableOpacity>
                    }
                </ScrollView>

                <View style={{marginTop:25}}>
                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:15,color:'#191D31'}}>Filtered Properties</Text>
                </View>

                {propDetails
                    .filter(item => item.AvailableFractions > 0)
                    .filter((prop) => {
                        if(propertyType === 'VILLA'){
                            return prop.P_Type === 'VILLA'
                        }else if(propertyType === 'RESORT'){
                            return prop.P_Type === 'RESORT'
                        }else if(propertyType === 'APARTMENT'){
                            return prop.P_Type === 'APARTMENT'
                        }else if(propertyType === 'HOTEL'){
                            return prop.P_Type === 'HOTEL'
                        }else if(propertyType === 'HOTEL PROPERTY'){
                            return prop.P_Type === 'HOTEL PROPERTY'
                        }else{
                            return true;
                        }
                    })
                    .filter((loc) => {
                        if(location !== ''){
                            return loc.city?.toLowerCase() === location.toLowerCase();
                        } else{
                            return true;
                        }
                    })
                    .filter((item) => {
                        const price = parseInt(item.FC_Price.replace(/[^\d]/g, '')); 
                        return price >= priceRange[0] && price <= priceRange[1];
                      })
                    .map((item, index) => {
                        const itemName = item?.name;
                        const propId = item?._id;
                        const isLiked = likedProperty.includes(propId);
                        if(!scaleAnimation[itemName]) {
                            scaleAnimation[itemName] = new Animated.Value(1);
                        }
                return(
                    <TouchableOpacity onPress={() => {
                        console.log(item);
                        

                          navigation.navigate('Property', { details: item });
                       // navigation.navigate('CoOwnPropDetail', { details : propDetails, data : item, });
                    }} key={index} style={{borderColor:'#0000001A',borderWidth:1,backgroundColor:'#FFFFFF',padding:10,elevation:5,marginTop:20}}>
                        <View>
                            <View>
                                <Image source={{uri: item?.image?.Image1}} style={{width:'100%',height:200}}/>
                                <View style={{position:'absolute',bottom:-25,right:25}}>
                                    <Image resizeMode='contain' source={{uri : 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/HotProperty.png'}} style={{width:60,height:100}}/>
                                </View>
                            </View>
                            <View style={{position:'absolute',top:15,left:15}}>
                                <TouchableOpacity onPress={() => {
                                    triggerScaleAnimation(itemName);
                                    toggleLike(itemName);
                                    if(isLiked) {
                                        handleRemoveLike(propId);
                                        setLikedProperty(prev => prev.filter(id => id !== propId));
                                    } else {
                                        handleLike(propId);
                                        setLikedProperty(prev => [...prev, propId]);
                                    }
                                }} style={{}}>
                                    <LinearGradient 
                                        colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                                        style={{width:36,height:36,borderRadius:36,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'}}
                                    >
                                        <Animated.View style={{transform: [{scale: scaleAnimation[itemName]}]}}>
                                            {isLiked ? (
                                                <Ico name={'heart'} size={20} color="#ED1C24"/>
                                            ) : (
                                                <Ico name={'heart-outline'} size={20} color="#ED1C24"/>
                                            )}
                                        </Animated.View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{paddingHorizontal:10,marginTop:15}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000000'}}>{item?.name}</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#1E3A8A'}}>₹{item?.Price}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#000000'}}>Frac value:</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#1E3A8A'}}>₹ {item?.FC_Price}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#000000'}}>Available Frac</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#1E3A8A'}}>{item?.AvailableFractions}</Text>
                                </View>
                            </View>
                            <View style={{borderColor:'#00000024',borderTopWidth:1,marginVertical:8}}></View>

                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                    <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png'}} style={{width:18, height:18}}/>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#181D27',marginLeft:10}}>{item?.area}</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                    <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png'}} style={{width:20, height:20}}/>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#181D27',marginLeft:7}}>{item?.P_Type}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )})}

                {propDetails
                    .filter(item => item.AvailableFractions == 0)
                    .filter((prop) => {
                        if(propertyType === 'VILLA'){
                            return prop.P_Type === 'VILLA'
                        }else if(propertyType === 'RESORT'){
                            return prop.P_Type === 'RESORT'
                        }else if(propertyType === 'APARTMENT'){
                            return prop.P_Type === 'APARTMENT'
                        }else if(propertyType === 'HOTEL'){
                            return prop.P_Type === 'HOTEL'
                        }else if(propertyType === 'HOTEL PROPERTY'){
                            return prop.P_Type === 'HOTEL PROPERTY'
                        }else{
                            return true;
                        }
                    })
                    .filter((loc) => {
                        if(location !== ''){
                            return loc.city?.toLowerCase() === location.toLowerCase();
                        }else{
                            return true;
                        }
                    })
                    .filter((item) => {
                        const price = parseInt(item.FC_Price.replace(/[^\d]/g, '')); 
                        return price >= priceRange[0] && price <= priceRange[1];
                      })
                    .map((item, index) => {
                        const itemName = item?.name;
                        const propId = item?._id;
                        const isLiked = likedProperty.includes(propId);
                        if(!scaleAnimation[itemName]) {
                            scaleAnimation[itemName] = new Animated.Value(1);
                        }

                    return(
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Property', { details: item });
                       // navigation.navigate('CoOwnPropDetail', { details : propDetails, data : item });
                    }} key={index} style={{borderColor:'#0000001A',borderWidth:1,backgroundColor:'#FFFFFF',padding:10,elevation:5,marginTop:20}}>
                        <View>
                            <ImageBackground source={{uri : item?.image?.Image1}} style={{width:'100%',height:200}}>
                                <View style={{flex:1,backgroundColor:'#FFFCFC7F'}}></View>
                            </ImageBackground>
                            <View style={{position:'absolute',top:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1,width:'100%'}}>
                                <TouchableOpacity onPress={() => {
                                    triggerScaleAnimation(itemName);
                                    toggleLike(itemName);
                                    if(isLiked) {
                                        handleRemoveLike(propId);
                                        setLikedProperty(prev => prev.filter(id => id !== propId));
                                    } else {
                                        handleLike(propId);
                                        setLikedProperty(prev => [...prev, propId]);
                                    }
                                }} style={{marginLeft:15}}>
                                    <LinearGradient 
                                        colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                                        style={{width:36,height:36,borderRadius:36,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'}}
                                    >
                                        <Animated.View style={{transform: [{scale: scaleAnimation[itemName]}]}}>
                                            {isLiked ? (
                                                <Ico name={'heart'} size={20} color="#ED1C24"/>
                                            ) : (
                                                <Ico name={'heart-outline'} size={20} color="#ED1C24"/>
                                            )}
                                        </Animated.View>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <View>
                                    <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/sold.png'}} style={{width:90,height:30}}/>
                                </View>
                            </View>
                        </View>
                        <View style={{paddingHorizontal:10,marginTop:15}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000000'}}>{item?.name}</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#1E3A8A'}}>₹ {item?.Price}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#000000'}}>Frac value:</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#1E3A8A'}}>₹ {item?.FC_Price}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                                <View style={{flex:2}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#000000'}}>Available Frac</Text>
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#1E3A8A'}}>{item?.AvailableFractions}</Text>
                                </View>
                            </View>
                            <View style={{borderColor:'#00000024',borderTopWidth:1,marginVertical:8}}></View>

                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                    <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png'}} style={{width:18, height:18}}/>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#181D27',marginLeft:10}}>{item?.area}</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                                    <Image source={{uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png'}} style={{width:20, height:20}}/>
                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#181D27',marginLeft:7}}>{item?.P_Type}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )})}
            </View>
        </ScrollView>

        {/* --------------------------------------Filters-------------------------------------- */}

        { visible &&
            <Modal visible={true} modalStyle={{width:width,flex:1}}>
                <View style={{flex:1,backgroundColor:'#FAFAFA'}}>
                        <View style={{backgroundColor:'#FFFFFF',padding:20,flexDirection:'row',justifyContent:'space-between',elevation:5,alignItems:'center'}}>
                            <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#191D31'}}>Filter by</Text>
                            <TouchableOpacity onPress={() => {
                                setPropertyType('');
                                setLocation('');
                                if (priceRange[0] !== defaultRange[0] || priceRange[1] !== defaultRange[1]) {
                                    setPriceRange(defaultRange);
                                  }
                            }} style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:15,color:'#191D31'}}>Reset</Text>
                                <Ico name={'refresh'} size={17} color={'#000000'} style={{marginLeft: 10}}/>
                            </TouchableOpacity>
                        </View>
                
                        <View style={{flex:1,flexDirection:'row',elevation:5}}>
                            <View style={{flex:1}}>
                                <TouchableOpacity onPress={() => {
                                    setFilterBy('Property Type');
                                }} style={{marginTop:20,padding:20,backgroundColor:filterBy=='Property Type'?'#FFFFFF':'',borderLeftWidth:filterBy=='Property Type'?5:0,borderLeftColor:'#1849D6'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:filterBy=='Property Type'?'#386BF6':'#000000'}}>Property Type</Text>
                                </TouchableOpacity>
                
                                <TouchableOpacity onPress={() => {
                                    setFilterBy('Location');
                                }} style={{backgroundColor:filterBy=='Location'?'#FFFFFF':'',padding:20,borderLeftWidth:filterBy=='Location'?5:0,borderLeftColor:'#1849D6'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:filterBy=='Location'?'#386BF6':'#000000'}}>Location</Text>
                                </TouchableOpacity>
                
                                <TouchableOpacity onPress={() => {
                                    setFilterBy('Price Range');
                                }} style={{padding:20,backgroundColor:filterBy=='Price Range'?'#FFFFFF':'',borderLeftWidth:filterBy=='Price Range'?5:0,borderLeftColor:'#1849D6'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:filterBy=='Price Range'?'#386BF6':'#000000'}}>Price range</Text>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:10,color:filterBy == 'Price Range'?'#386BF68F':'#00000047'}}>(Per Frac)</Text>
                                </TouchableOpacity>
                
                                <TouchableOpacity onPress={() => {
                                    setFilterBy('Coupons');
                                }} style={{backgroundColor:filterBy=='Coupons'?'#FFFFFF':'',padding:20,borderLeftWidth:filterBy=='Coupons'?5:0,borderLeftColor:'#1849D6'}}>
                                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:filterBy=='Coupons'?'#386BF6':'#000000'}}>Coupons</Text>
                                </TouchableOpacity>
                            </View>
                
                            <View style={{borderLeftColor:'#00000021',borderLeftWidth:1}}></View>
                
                            <View style={{flex:1.5}}>
                                {filterBy == 'Property Type' &&
                                    <View>
                                        { uniqueTypes.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => {
                                                setPropertyType(prev => prev?.toLowerCase() === item.name.toLowerCase() ? '' : item.name);
                                            }} style={{flexDirection:'row',marginTop:25,paddingHorizontal:20,justifyContent:'space-between'}}>
                                                <View style={{flex:1}}>
                                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#000000'}}>{item?.name}</Text>
                                                </View>
                                                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:13,color:'#0000004D'}}>{item?.count}</Text>
                                                    {propertyType?.toLowerCase() === item.name.toLowerCase() ?
                                                        <Ico name={'checkbox'} size={20} color={'#386BF6'}/>
                                                        : <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'}/>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                }
                
                                {filterBy == 'Location' &&
                                    <View>
                                        {uniqueCities.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => {
                                                    setLocation(prev => prev?.toLowerCase() === item.name.toLowerCase() ? '' : item.name);
                                                }}
                                                style={{flexDirection: 'row',marginTop: 25,paddingHorizontal: 20,justifyContent: 'space-between'
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#000000' }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0000004D' }}>
                                                        {item.count}
                                                    </Text>
                                                    {location?.toLowerCase() === item.name.toLowerCase() ? (
                                                        <Ico name={'checkbox'} size={20} color={'#386BF6'} />
                                                    ) : (
                                                        <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'} />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                }
                
                                {filterBy == 'Price Range' &&
                                    <View style={{flex:1}}>
                                        <View style={{marginTop:25,paddingHorizontal:20}}>
                                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:'#000000'}}>Choose Price Range</Text>
                                        </View>
                                        <View style={{margin:20}}>
                                            <MultiSlider
                                                style={{width : width*0.5}}
                                                values={priceRange}
                                                sliderLength={width*0.48}
                                                onValuesChange={(values) => setPriceRange(values)}
                                                min={500000}
                                                max={3000000}
                                                step={100000}
                                                selectedStyle={{
                                                    backgroundColor:'#2853CE',
                                                }}
                                                unselectedStyle={{
                                                    backgroundColor:'#E3E3E3'
                                                }}
                                                customMarker={(e) => (
                                                    <View style={{ alignItems: 'center', }}>
                                                        {/* Marker Dot */}
                                                        <View style={{width: 20,height: 20,backgroundColor: '#2853CE',borderRadius: 10,marginTop:40}} />
                                                        {/* Label Below Marker */}
                                                        <Text style={{marginTop: 5,fontSize: 12,fontFamily: 'WorkSans-Medium',color: '#2853CE',}}>
                                                            ₹{e.currentValue.toLocaleString('en-IN')}
                                                        </Text>
                                                    </View>
                                                )}
                                            />
                                        </View>
                                        <View style={{marginTop:20,paddingHorizontal:20}}>
                                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:13,color:'#000000'}}>Finalized Price Range</Text>
                
                                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
                                                <View style={{}}>
                                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#101010'}}>Min</Text>
                                                    <Text style={{color:'#386BF6',fontFamily:'Montserrat-SemiBold',fontSize:15,marginTop:5}}>
                                                        {`₹${priceRange[0]}`}
                                                    </Text>
                                                </View>
                                                <View style={{}}>
                                                    <Text style={{fontFamily:'Montserrat-Medium',fontSize:12,color:'#101010'}}>Max</Text>
                                                    <Text style={{color:'#386BF6',fontFamily:'Montserrat-SemiBold',fontSize:15,marginTop:5}}>
                                                        {`₹${priceRange[1]}`}
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:20,color:'#386BF6',marginTop:10}}>{`₹${priceRange[1]}`}</Text> */}
                                        </View>
                                    </View>
                                }
                
                                {filterBy == 'Coupons' && 
                                    <View >
                                        <View style={{marginTop:25,paddingHorizontal:20}}>
                                            <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:14,color:'#000000'}}>Diwali Offers</Text>
                                        </View>
                
                                        {couponsData.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => {
                                                setCoupons(prev => prev === item?.cou ? '' : item?.cou);
                                            }} style={{flexDirection:'row',marginTop:20,paddingHorizontal:20,}}>
                                                <View style={{flex:1,flexDirection:'row'}}>
                                                    <Text style={{fontFamily:'Montserrat-Bold',fontSize:10,color:'#000000'}}>•</Text>
                                                
                                                    <View style={{paddingHorizontal:5}}>
                                                        <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#000000'}}>
                                                            Get off <Text style={{fontFamily:'WorkSans-SemiBold',fontSize:12,color:'#386BF6'}}>{item?.price}</Text> on any {item?.cou} Purchase
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    {coupons == item?.cou ?
                                                        <Ico name={'checkbox'} size={20} color={'#386BF6'}/>
                                                        : <Ico name={'checkbox-outline'} size={20} color={'#D9D9D9'}/>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                }
                            </View>
                        </View>
                
                        <View style={{backgroundColor:'#FFFFFF',paddingHorizontal:20,paddingVertical:35,elevation:5}}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => {
                                    // navigation.navigate('PropertyListing', {details : propDetails});
                                    setVisible(!visible);
                                }} style={{backgroundColor:'#0F1130',borderColor:'#000000',borderWidth:1,padding:10,flex:1,marginHorizontal:20,alignItems:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:15,color:'#FFFFFF'}}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    // navigation.navigate('PropertyListing',{ prop: propertyType ,details: propDetails, location : location });
                                    // console.log("wvevwe",propertyType)
                                    setVisible(!visible);
                                }} style={{backgroundColor:'#F0F4FA',borderWidth:1,borderColor:'#9DB2CE30',padding:10,flex:1,marginHorizontal:20,alignItems:'center'}}>
                                    <Text style={{fontFamily:'WorkSans-Medium',fontSize:15,color:'#021265'}}>Apply Filters</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
        }
    </SafeAreaView>
  )
}


