import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, StyleSheet, FlatList, Linking, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Entypo';
import Ic from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { LikeData, PropertyDetails, Like, DisLike, } from '../Services/UserApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../Context/AppContext';
import Footer from '../Footer';



export default function CownHome() {
    const { globalState, setGlobalState } = useContext(AppContext);
    const { width, height } = Dimensions.get('window');
    const [selectCountry, setSelectCountry] = useState('India');
    const testimonials = [
        {
            name: 'Abdul Basith',
            video: 'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial2.mp4',
            image: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial1.png',
            transcript: [
                { start: 0.0, end: 11.0, text: 'Hi, this is Abdul Basit and that\'s my wife  Bushra Khan. Yeah, so I\'ve invested in a Fracspace in the Goa property.' },
                { start: 12.0, end: 23.0, text: 'This idea like actually came across in a reality expo and since then You know, it has been quite exciting and interesting to know about this opportunity.' },
                { start: 26.0, end: 34.0, text: 'Talking about investment point of view, I see a good value proposition and at the same time what makes a difference is that the company culture,' },
                { start: 35.0, end: 43.0, text: 'The people in this whole startup and I feel the staff has been really supportive and have been very patient in giving good information.' },
                // { start: 45.0, end: 56.0, text: 'The details of the investment etc. And for me personally I think the returns are something far more exciting and that\'s the reason why I chose this.' },
                // { start: 57.0, end: 66.0, text: 'Besides this I think it\'s a good way to diversify your investment and so far it is going all well.' },
                // { start: 56.0, end: 77.0, text: 'And in the near future, I also aim to scale up my investment once I have a little more experience of going through this journey.' },
                // { start: 78.0, end: 88.0, text: 'I think FracSpace is doing quite a fantastic job here. And I feel, you know, grateful that I came across this opportunity.' },
                // { start: 90.0, end: 102.0, text: 'Besides this, yes, it is just the beginning I would say and looking forward to their success, where eventually my success would lie in theirs. So yeah, thank you so much.' },
            ],
        },
        {
            name: 'Srinivas',
            video: 'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial3.mp4',
            image: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial2.png',
            transcript: [
                { start: 0.0, end: 7.0, text: 'Hi, my name is Srinivas I am from Indusind Bank. I got to know about this Fracspace through an expo.' },
                // { start: 4.0, end: 6.0, text: ' ' },
                { start: 8.0, end: 15.0, text: 'I interested in  becoming a  part of this. Looks very interesting, the team is very good.' },
                { start: 15.0, end: 22.0, text: 'And  like the concept When you get an opportunity to invest a small amount and get ownership' },
                { start: 22.0, end: 27.0, text: 'with a good return I showed this thing, nothing like it so I went for it.' },
                { start: 27.0, end: 29.0, text: 'I request all of you to consider it. It\'s a good option.' },
                { start: 30.0, end: 37.0, text: 'I find it interesting and getting to know a lot of people coming into this community. I am enjoying it a lot. Thanks.' },
            ],
        },
        {
            name: 'Prashanth & Nikita',
            video: 'https://fracspace-properties.s3.ap-south-1.amazonaws.com/fracspace_properties_images/testimonials/testimonial1.mp4',
            image: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/testimonial3.png',
            transcript: [
                { start: 0.0, end: 5.0, text: 'Hi, I\'m Prashant and this is Nikita.We\'re both software engineers.' },
                // { start: 3.0, end: 4.0, text: '' },
                { start: 6.0, end: 13.0, text: 'We like the idea of fractional ownership.We thought this was a good entry point.' },
                { start: 14.0, end: 21.0, text: 'We found fracspace and then we found that the business model interesting and then the transparency.' },
                { start: 21.0, end: 24.0, text: 'We asked them a lot of questions and they answered it very well. ' },
                { start: 25.0, end: 29.0, text: 'We just started with one property investment.' },
                { start: 30.0, end: 35.0, text: 'Yeah, we\'re enjoying it so far and then we\re looking to do more business with them.' },
            ],
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [propDetails, setPropDetails] = useState(globalState?.ProDetails);
    const [ProfileDisplay, setProfileDisplay] = useState(globalState?.userDetails?.profilePicture);
    const [srilankaProp, setSrilankaProp] = useState([]);
    const [indianProp, setIndianProp] = useState([]);

    const [offerImage, setOfferImage] = useState([]);
    const [promise, setPromise] = useState([]);
    const [like, setLike] = useState([]);
    const [likedProperty, setLikedProperty] = useState([]);
    // const [currentTime, setCurrentTime] = useState(0);
    const [playStates, setPlayStates] = useState(testimonials.map(() => false));
    const [currentTimes, setCurrentTimes] = useState(testimonials.map(() => 0));
    const [durations, setDurations] = useState(testimonials.map(() => 0));
    const transcriptScrollRefs = useRef([]);
    const videoRefs = useRef([]);
    const [videoEnded, setVideoEnded] = useState(testimonials.map(() => false));
    const [showThumbnails, setShowThumbnails] = useState(testimonials.map(() => true));

    const togglePlay = (index) => {
        const updatedPlayStates = [...playStates];
        updatedPlayStates[index] = !playStates[index];
        setPlayStates(updatedPlayStates);

        if (showThumbnails[index]) {
            const updatedThumbnails = [...showThumbnails];
            updatedThumbnails[index] = false;
            setShowThumbnails(updatedThumbnails);
        }

        if (videoEnded[index]) {
            videoRefs.current[index]?.seek(0);
            const updatedEnded = [...videoEnded];
            updatedEnded[index] = false;
            setVideoEnded(updatedEnded);
        }
    };

    const swiperRef = useRef(null);
    const cardWidth = 250;
    const wireHeight = 100;
    const navigation = useNavigation();
    const scaleAnimation = useRef({}).current;

    useFocusEffect(
        useCallback(() => {
            fetchLikedProperty();
        }, [])
    );



    const fetchPropertyDetails = async () => {
        try {
            let { data: res } = await PropertyDetails();

            if (res?.success) {
                // let details = res?.properties;
                let offers = res?.offers;

                // set Benefits from first property
                setPromise(res?.properties[0]?.Benefits);
                setPropDetails(res?.properties);

                // Split into two arrays
                const srilankaProperties = res?.properties.filter(item => item.country === "srilanka");
                const indianProperties = res?.properties.filter(item => !item.country && item.PropertyType == 'Domastic');
                indianProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
                setSrilankaProp(srilankaProperties);
                setIndianProp(indianProperties);

                // Handle offers images
                if (offers && offers.length > 0) {
                    const validImages = Object.entries(offers[0])
                        .filter(([key, value]) => key.startsWith("image") && value?.trim())
                        .map(([_, value]) => value);

                    setOfferImage(validImages);
                }
            } else {
                console.log("Failed to Get Property Details", res.message || res);
            }
        } catch (error) {
            console.error("Error in Fetching Property Details: ", error.response?.data || error.message);
        }
    };


    const fetchLikedProperty = async () => {
        let payload = JSON.stringify(
            {
                email: globalState?.userEmail,
            }
        );
        try {
            let { data: res } = await LikeData(payload);
            if (res?.success) {
                const likeProp = res?.properties.map(item => item._id);
                // console.log("Likes: ",likeProp);
                setLikedProperty(likeProp);
            } else {
                console.log("Error in fetching liked property: ", res.message || res);
            }
        } catch (error) {
            console.error("Error in Fetching Liked Hotels: ", error.response?.data || error.message);
        }
    };

    const handleLike = async (propId) => {
        let payload = JSON.stringify(
            {
                email: globalState?.userEmail,
                propertyId: propId
            }
        );
        try {
            let { data: res } = await Like(payload);
            if (res?.success) {
                console.log("Response: ", res);
            } else {
                console.log("Failed to handle like: ", res.message || res);
            }
        } catch (error) {
            console.error("Error in Liking Property: ", error.response?.data || error.message);
        }
    }

    const handleRemoveLike = async (propId) => {
        let payload = JSON.stringify(
            {
                email: globalState?.userEmail,
                propertyId: propId
            }
        );
        try {
            let { data: res } = await DisLike(payload);
            if (res?.success) {
                console.log("Response: ", res);
            } else {
                console.log("Failed to remove like: ", res.message || res);
            }
        } catch (error) {
            console.error("Error in Removing Liked Prop: ", error.response?.data || error.message);
        }
    }

    // const goNext = () => {
    //     swiperRef.current.scrollBy(1);
    // };

    // const goPrev = () => {
    //     swiperRef.current.scrollBy(-1);
    // };

    const Wire = ({ cardCount, segmentWidth = 400, height = 70 }) => {
        const wavePath = generateWavePath(cardCount, segmentWidth);

        return (
            <Svg
                width={cardCount * segmentWidth}
                height={height}
                style={{ position: 'absolute', top: 20, left: 0 }}
            >
                <Path
                    d={wavePath}
                    stroke="#999"
                    strokeWidth={1}
                    fill="none"
                />
            </Svg>
        );
    };

    const generateWavePath = (cardCount, segmentWidth, amplitude = 30, midline = 30) => {
        let path = `M0,${midline}`;
        for (let i = 0; i < cardCount; i++) {
            const startX = i * segmentWidth;
            const cp1X = startX + segmentWidth * 0.25;
            const cp2X = startX + segmentWidth * 0.75;
            const endX = startX + segmentWidth;

            path += ` C${cp1X},${midline - amplitude} ${cp2X},${midline + amplitude} ${endX},${midline}`;
        }
        return path;
    };

    const toggleLike = (item) => {
        setLike((prevSelected) =>
            prevSelected.includes(item)
                ? prevSelected.filter((selected) => selected !== item)
                : [...prevSelected, item]
        );
    };

    const triggerScaleAnimation = (itemName) => {
        if (!scaleAnimation[itemName]) {
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

    useEffect(() => {
        const srilankaProperties = propDetails.filter(item => item.country === "srilanka");
        const indianProperties = propDetails.filter(item => !item.country && item.PropertyType == 'Domastic');
        indianProperties.sort((a, b) => (a.num > b.num ? 1 : -1));
        setSrilankaProp(srilankaProperties);
        setIndianProp(indianProperties);
        fetchPropertyDetails();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchLikedProperty();
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#021265' }}>
            <View style={{ flex: 1, backgroundColor: '#FAFAFF' }}>
                <ScrollView style={{ backgroundColor: '#FAFAFA', }}>
                    <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={ProfileDisplay != undefined ? {
                                uri: ProfileDisplay,
                            } : require('../assets/Profile.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 12, color: '#8C8E98' }}>Welcome Back</Text>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 15, color: '#191D31' }}>{globalState?.userName}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('HomePage');
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#8C8E98', marginLeft: 20 }}>Exit</Text>
                        </TouchableOpacity>
                    </View>

                    <LinearGradient colors={['#E9EFF9', '#FAFAFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ marginVertical: 20 }}>
                        <Swiper
                            ref={swiperRef}
                            loop={true}
                            autoplay={true}
                            showsPagination
                            onIndexChanged={(index) => setCurrentIndex(index)}
                            autoplayTimeout={3}
                            dotStyle={{ backgroundColor: '#081F6247', width: 10, height: 8, borderRadius: 4 }}
                            activeDotStyle={{ backgroundColor: '#081F62', width: 30, height: 8, borderRadius: 4 }}
                            paginationStyle={{ position: 'absolute', bottom: 5 }}
                            style={{ height: 245 }}
                        >
                            {offerImage && offerImage.length > 0 && offerImage.map((url, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: url }}
                                    style={{ width: width, height: 220 }}
                                    resizeMode="contain"
                                />
                            ))}

                        </Swiper>

                        {/* Next Button */}
                        {/* <TouchableOpacity
                onPress={goNext}
                style={{backgroundColor: '#121214',width: 50,height: 50,borderRadius: 50,position: 'absolute',right: -25,top: '40%'}}
            >
                <Ico name={'chevron-right'} size={22} color={'#FFFFFF'} style={{ marginTop: 14, marginLeft: 5 }} />
            </TouchableOpacity> */}

                        {/* Previous Button */}
                        {/* <TouchableOpacity
                onPress={goPrev}
                style={{backgroundColor: '#121214',width: 50,height: 50,borderRadius: 50,position: 'absolute',left: -25,top: '40%'}}
            >
                <Ico name={'chevron-left'} size={22} color={'#FFFFFF'} style={{ marginTop: 14, marginLeft: 22 }} />
            </TouchableOpacity> */}
                    </LinearGradient>



                    <View style={{ backgroundColor: '#9DB2CE3D', borderRadius: 30, flexDirection: 'row', alignItems: 'center', margin: 20 }}>
                        <TouchableOpacity onPress={() => {
                            setSelectCountry('India');
                        }} style={{ padding: 15, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'India' ? '#0F1130' : 'transparent', borderRadius: 30 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'India' ? '#FFF' : '#000' }}>India</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelectCountry('SriLanka');
                        }} style={{ padding: 15, flex: 1, alignItems: 'center', backgroundColor: selectCountry === 'SriLanka' ? '#0F1130' : 'transparent', borderRadius: 30 }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 16, color: selectCountry == 'SriLanka' ? '#FFF' : '#000' }}>SriLanka</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>Recommended Properties</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('CownPropertyList', { details: indianProp });
                    }} style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 17, color: '#000000' }}>India Spaces</Text>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#386BF6' }}>View More</Text>
                    </TouchableOpacity> */}

                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>Recommended Properties</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('PropertyListing', { indiaProp: indianProp, lankaProp: srilankaProp })
                        }}>
                            <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, color: '#386BF6' }}>View More</Text>
                        </TouchableOpacity>
                    </View>

                    {selectCountry == 'India' && <ScrollView horizontal={true} style={{ padding: 20 }} showsHorizontalScrollIndicator={false}>
                        {indianProp
                            .filter(item => item.AvailableFractions > 0)
                            .map((item, index) => {
                                const itemName = item?.name;
                                const propId = item?._id;
                                const isLiked = likedProperty.includes(propId);
                                if (!scaleAnimation[itemName]) {
                                    scaleAnimation[itemName] = new Animated.Value(1);
                                }
                                return (
                                    <TouchableOpacity onPress={() => {
                                        // console.log(item);
                                        navigation.navigate('Property', { details: item });
                                        // navigation.navigate('CoOwnPropDetail', { data: item })
                                    }} key={index} style={{ backgroundColor: '#F9F9F9', borderColor: '#00000014', borderWidth: 1, padding: 10, elevation: 5, width: width * 0.65, marginRight: 20 }}>
                                        <Image resizeMode='cover' source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 150, }} />
                                        <View style={{ position: 'absolute', top: 15, left: 15 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: '#FFFFFF' }}>{item?.city}</Text>
                                            </View>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000000' }}>{item?.name}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    triggerScaleAnimation(itemName);
                                                    toggleLike(itemName);
                                                    if (isLiked) {
                                                        handleRemoveLike(propId);
                                                        setLikedProperty(prev => prev.filter(id => id !== propId));
                                                    } else {
                                                        handleLike(propId);
                                                        setLikedProperty(prev => [...prev, propId]);
                                                        //  runLikeAnimation(item?.image?.Image1); 
                                                        //  bottomTabRef.current?.animateToLikedTab();

                                                    }
                                                }} style={{}}>
                                                    <LinearGradient
                                                        colors={isLiked ? ["#FFFFFF", "#FFFFFF"] : ["#FFFFFF", '#FFFFFF']}
                                                        style={{ width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 5, backgroundColor: '#FFFFFF' }}
                                                    >
                                                        <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                                                            {isLiked ? (
                                                                <Icon name={'heart'} size={20} color="#ED1C24" />
                                                            ) : (
                                                                <Icon name={'heart-outline'} size={20} color="#ED1C24" />
                                                            )}
                                                        </Animated.View>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                <Text style={{ fontFamily: 'Montserrat-Meidum', fontSize: 11, color: '#00000099' }}>Total Frac Value: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5 }}>₹ {item?.Price}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099' }}>Frac Value: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5 }}>₹ {item?.FC_Price}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099' }}>Available Frac: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000000', marginLeft: 5 }}>{item?.AvailableFractions}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                    <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png' }} style={{ width: 15, height: 15 }} />
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181D27', marginLeft: 10 }}>{item?.area}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                    <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png' }} style={{ width: 15, height: 15 }} />
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181D27', marginLeft: 7 }}>{item?.P_Type}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                    </ScrollView>}

                    {/* <TouchableOpacity onPress={() => {
                        navigation.navigate("CownPropertyList", { details: srilankaProp })
                    }} style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 17, color: '#000' }}>Sri Lanka Spaces</Text>
                        <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 13, color: '#386BF6' }}>View More</Text>
                    </TouchableOpacity> */}

                    {selectCountry == 'SriLanka' &&
                        <ScrollView horizontal={true} style={{ padding: 20 }} showsHorizontalScrollIndicator={false}>
                            {srilankaProp
                                .filter(item => item.AvailableFractions > 0)
                                .map((item, index) => {
                                    const itemName = item?.name;
                                    const propId = item?._id;
                                    const isLiked = likedProperty.includes(propId);
                                    if (!scaleAnimation[itemName]) {
                                        scaleAnimation[itemName] = new Animated.Value(1);
                                    }
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('Property', { details: item });
                                            // navigation.navigate('CoOwnPropDetail', { data: item })
                                        }} key={index} style={{ backgroundColor: '#F9F9F9', borderColor: '#00000014', borderWidth: 1, padding: 10, elevation: 5, width: width * 0.65, marginRight: 20 }}>
                                            <Image resizeMode='cover' source={{ uri: item?.image?.Image1 }} style={{ width: '100%', height: 150 }} />
                                            <View style={{ position: 'absolute', top: 15, left: 15 }}>
                                                <View>
                                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: '#FFF' }}>{item.city}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13, color: '#000' }}>{item?.name}</Text>
                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        triggerScaleAnimation(itemName);
                                                        toggleLike(itemName);
                                                        if (isLiked) {
                                                            handleRemoveLike(propId);
                                                            setLikedProperty(prev => prev.filter(id => id !== propId));
                                                        } else {
                                                            handleLike(propId);
                                                            setLikedProperty(prev => [...prev, propId]);
                                                        }
                                                    }}>
                                                        <LinearGradient colors={['#FFF', '#FFF']}
                                                            style={{ width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 5, backgroundColor: '#FFF' }}
                                                        >
                                                            <Animated.View style={{ transform: [{ scale: scaleAnimation[itemName] }] }}>
                                                                {isLiked ? (
                                                                    <Icon name={'heart'} size={20} color="#ed1c24" />
                                                                ) : (
                                                                    <Icon name={'heart-outline'} size={20} color='#ed1c24' />
                                                                )}
                                                            </Animated.View>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099' }}>Total Frac Value: </Text>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000', marginLeft: 5 }}>₹ {item?.Price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099' }}>Frac Value: </Text>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000', marginLeft: 5 }}>₹ {item?.FC_Price}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 11, color: '#00000099' }}>Available Frac: </Text>
                                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 11, color: '#000', marginLeft: 5 }}>{item?.AvailableFractions}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                        <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/square.png' }} style={{ width: 15, height: 15 }} />
                                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181d27', marginLeft: 10 }}>{item?.area}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                        <Image source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/building.png' }} style={{ width: 15, height: 15 }} />
                                                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 9, color: '#181d27', marginLeft: 10 }}>{item?.P_Type}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                        </ScrollView>}

                    {/* <View style={{ padding: 20, paddingVertical: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>Fracspace Promise</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                            {promise.map((item, index) => (
                                <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                                    <Image source={{ uri: item?.image }} style={{ width: 60, height: 70 }} />
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 10, color: '#000000', textAlign: 'center', marginTop: 5 }}>{item?.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View> */}

                    {/* <View style={{ marginVertical: 20 }}>
                        <Image resizeMode='cover' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/gift.png' }} style={{ width: width, height: 310 }} />
                    </View> */}

                    <View style={{ padding: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>Testimonials</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'column', paddingBottom: 50 }}>
                                {/* Wire */}
                                <Wire cardCount={3} width={testimonials.length * (cardWidth + 200)} height={wireHeight} />

                                {/* Cards with clips */}
                                <View style={{ flexDirection: 'row', marginTop: 70, paddingHorizontal: 20, }}>
                                    {testimonials.map((item, index) => (
                                        <View key={index} style={{ width: 280, marginRight: 100, alignItems: 'center' }}>
                                            {/* Clip */}
                                            <Image
                                                source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/clip.png' }}
                                                style={{
                                                    width: 40, height: 40, position: 'absolute', top: -40, zIndex: 2,
                                                    right: index % 2 === 0 ? 15 : undefined,
                                                    left: index % 2 !== 0 ? 5 : undefined,
                                                }}
                                            />

                                            {/* Testimonial Card */}
                                            <View style={{
                                                borderWidth: 1, borderColor: '#0000001A', backgroundColor: '#E6E6E670', width: '100%', padding: 10, height: 350,
                                                transform: [{ rotate: index % 2 === 0 ? '-10deg' : '10deg' }],
                                            }}>
                                                <TouchableOpacity activeOpacity={1} onPress={() => togglePlay(index)}>
                                                    <Video
                                                        ref={ref => (videoRefs.current[index] = ref)}
                                                        source={{ uri: item?.video }}
                                                        style={{ width: '100%', height: 150, marginBottom: 8 }}
                                                        resizeMode="cover"
                                                        paused={!playStates[index]}
                                                        onEnd={() => {
                                                            const updatedPlayStates = [...playStates];
                                                            updatedPlayStates[index] = false;
                                                            setPlayStates(updatedPlayStates);

                                                            const updatedEnded = [...videoEnded];
                                                            updatedEnded[index] = true;
                                                            setVideoEnded(updatedEnded);
                                                        }}
                                                        onProgress={({ currentTime }) => {
                                                            const updatedTimes = [...currentTimes];
                                                            updatedTimes[index] = currentTime;
                                                            setCurrentTimes(updatedTimes);

                                                            const activeLineIndex = item.transcript.findIndex(
                                                                line => currentTime >= line.start && currentTime <= line.end
                                                            );
                                                            if (activeLineIndex !== -1 && transcriptScrollRefs.current[index]) {
                                                                transcriptScrollRefs.current[index].scrollTo({
                                                                    y: activeLineIndex * 32,
                                                                    animated: true,
                                                                });
                                                            }
                                                        }}
                                                        onLoad={({ duration }) => {
                                                            const updatedDurations = [...durations];
                                                            updatedDurations[index] = duration;
                                                            setDurations(updatedDurations);
                                                        }}
                                                    />

                                                    {showThumbnails[index] && (
                                                        <Image source={{ uri: item.image }}
                                                            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, resizeMode: 'cover', zIndex: 1, }}
                                                        />
                                                    )}
                                                </TouchableOpacity>

                                                <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 15, color: '#000000', marginBottom: 8, }}>
                                                    {item.name}
                                                </Text>

                                                {/* Transcript Scrollable */}
                                                <ScrollView
                                                    ref={ref => (transcriptScrollRefs.current[index] = ref)}
                                                    style={{ maxHeight: 150 }}
                                                    showsVerticalScrollIndicator={false}
                                                >
                                                    {item.transcript.map((line, idx) => {
                                                        const isActive = currentTimes[index] >= line.start && currentTimes[index] <= line.end;
                                                        return (
                                                            <Text key={idx}
                                                                style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: isActive ? '#1A73E8' : '#0000007A', fontWeight: isActive ? 'bold' : 'normal', lineHeight: 18, }}
                                                            >
                                                                {line.text}
                                                            </Text>
                                                        );
                                                    })}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text style={{ fontFamily: 'WorkSans-SemiBold', fontSize: 20, color: '#000000' }}>We’re making news</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 20, gap: 20 }}>
                            <View style={{ backgroundColor: '#FFFFFF', padding: 20, width: width * 0.6, height: 300, elevation: 5, alignItems: 'center', justifyContent: 'space-between', marginRight: 20 }}>
                                <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/News1.png' }} style={{ width: 140, height: 60 }} />
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#00000099', textAlign: 'center' }}>
                                    Fracspace, founded in 2022, empowers middle-class investors to co-own luxury holiday homes through fr....
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL('https://www.etnownews.com/companies/tech-horizons-unveiling-forbes-picks-for-the-next-global-players-article-115661660');
                                }} style={{ borderColor: '#00000047', borderWidth: 1, backgroundColor: '#FFFFFF', alignItems: 'center', padding: 10 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 11, color: '#000000' }}>READ MORE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#FFFFFF', padding: 20, width: width * 0.6, height: 300, elevation: 5, alignItems: 'center', justifyContent: 'space-between', marginRight: 20 }}>
                                <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/News3.png' }} style={{ width: 140, height: 60 }} />
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#00000099', textAlign: 'center' }}>
                                    Fracspace is a pioneering prop-tech company revolutionizing real estate standards on a global scale.....
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL('https://www.deccanchronicle.com/general/fracspace-revolutionizes-real-estate-ownership-with-mobile-app-897133');
                                }} style={{ borderColor: '#00000047', borderWidth: 1, backgroundColor: '#FFFFFF', alignItems: 'center', padding: 10 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 11, color: '#000000' }}>READ MORE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#FFFFFF', padding: 20, width: width * 0.6, height: 300, elevation: 5, alignItems: 'center', justifyContent: 'space-between', marginRight: 20 }}>
                                <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/News4.png' }} style={{ width: 140, height: 60 }} />
                                <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#00000099', textAlign: 'center' }}>
                                    FracSpace, a fractional investment and ownership real estate firm, enables a unique investment experience through the channel of fractional investment....
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL('https://www.bizzbuzz.news/industry/fracspace-allows-fractional-ownership-of-properties-1212346');
                                }} style={{ borderColor: '#00000047', borderWidth: 1, backgroundColor: '#FFFFFF', alignItems: 'center', padding: 10 }}>
                                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 11, color: '#000000' }}>READ MORE</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                    <LinearGradient colors={['#E9EFF9', '#FAFAFA']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ padding: 20, paddingBottom: 100 }}>
                        <Image resizeMode='contain' source={{ uri: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Footer.png' }} style={{ width: width * 0.8, height: 140 }} />
                        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#0F1130', marginTop: 15 }}>Built for togetherness, designed for your future.</Text>
                    </LinearGradient>

                </ScrollView>
                {/* <Footer navigation={navigation} activeFooterTab={'home'} /> */}
            </View>
        </SafeAreaView>
    )
}



