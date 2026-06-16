import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Animated,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from "react-native-video";
import { useDispatch, useSelector } from 'react-redux';
import { altairaPropertyPromo } from '../../redux/reducer/propertyReducer';
import HomeSkeleton from '../../component/HomeSkeleton';
import { AltairaExp, UploadEnquiry } from '../../Services/UserApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../../Context/AppContext';
import FastImage from 'react-native-fast-image';

const AltairaExperience = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const {globalState} = useContext(AppContext);

  const [Properties, setProperties] = useState(globalState?.altairaPromo);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const {width, height} = Dimensions.get('window');

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });


  // const dispatch = useDispatch();
  // const Properties = useSelector(state => state.property.altairaPromoData);
  // const loading = useSelector(state => state.property.loading);
// console.log(Properties,'property===')
//   useEffect(() => {
//     dispatch(altairaPropertyPromo())
//   }, [])

  // useEffect(() => {
  //   altairaEx();
  // }, []);

  // const altairaEx = async () => {
  //   setLoading(true);
  //   try{
  //     const {data: res} = await AltairaExp();
  //     // console.log("Res: ", res?.data);
  //     if(res?.success){
  //       setProperties(res?.data);
  //     }
  //   }catch(error){
  //     console.error("Error in getting altaira experinece: ",error?.response?.data || error?.response?.message);
  //   }finally{
  //     setLoading(false);
  //   }
  // }

  const handleEnquiryForm = async() => {
    let payload = JSON.stringify({
      name: globalState?.userName,
      email: globalState?.userEmail,
      phoneNumber: globalState?.userDetails?.phoneNumber,
      message: "Interested"
    });
    console.log("Payload: ",payload);
    try{
      let {data: res} = await UploadEnquiry(payload);
      console.log("Upload Success: ", res);
      return res;
    } catch(error){
      console.error("Error in uploading enquiry form: ",error?.response?.message || error?.response?.data);
      return null;
    }
  }

  const block1 = Properties?.block1
  const block2 = Properties?.block2
  const block3 = Properties?.block3
  const block4 = Properties?.block4
  const block5 = Properties?.block5
  const block6 = Properties?.block6


  if (loading || !Properties || Object.keys(Properties)?.length === 0) {
  return <HomeSkeleton />;
}


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#000'}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          {block1?.video ? (
            <Video
              source={{ uri: block1?.video }}
              style={styles.heroMedia}
              resizeMode="cover"
              repeat
              muted
              paused={false}
              ignoreSilentSwitch="obey"
            />
          ) : (
            <><Text>Enter Image from Backend</Text></>
            // <Image
            //   source={{ uri: block1.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470" }}
            //   style={styles.heroMedia}
            // />
          )}

          {/* Overlay content */}
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <Icon name="chevron-left" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.heroTitle}>{block1?.subTitle}</Text>
            <Text style={styles.heroSubtitle}>{block1?.description}</Text>
          </View>
        </View>

        {block2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {block2?.heading.toUpperCase()}
            </Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={block2?.PropertyHighlights}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item }) => (
                <View style={styles.highlightImageBg}>
                  {item?.fileType === "video" ? (
                    <Video
                      source={{ uri: item?.file }}
                      style={StyleSheet.absoluteFill}
                      resizeMode="cover"
                      repeat
                      muted
                      paused={false}
                    />
                  ) : (
                    <ImageBackground
                      source={{ uri: item.file }}
                      style={StyleSheet.absoluteFill}
                      imageStyle={styles.highlightImageStyle}
                    />
                  )}
                  <View style={styles.imageShade} />
                  <View style={styles.imageTextContainer}>
                    <Text style={styles.imageTitle}>
                      {item?.title}
                    </Text>
                    <Text style={styles.imageDesc}>
                      {item?.description}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}


        {!block3?.hide && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
              THE ALTAIRA EXPERIENCE
            </Text>

            <Text style={[styles.experienceTitle1, { textAlign: "center" }]}>
              {block3?.heading}
            </Text>

            <FlatList
              data={block3?.highlights}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View>
                  <View style={styles.experienceRow}>
                    <View style={styles.iconWrapper}>
                      <Image source={{ uri: item?.icon }} style={styles.icon} />
                    </View>

                    <View style={styles.textWrapper}>
                      <Text style={{fontFamily:'WorkSans-Medium',fontSize:12,color:'#634E36'}}>{item?.title}</Text>
                      <Text style={{fontFamily:'WorkSans-Regular',fontSize:11,color:'#000',marginTop:5,lineHeight:16}}>{item?.description}</Text>
                    </View>
                  </View>

                  {index !== block3?.highlights?.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              )}
            />
          </View>
        )}

        {!block4?.hide && (
          <View style={styles.section1}>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>{block4?.heading.toUpperCase()}</Text>
            <Text style={[styles.experienceTitle1, { textAlign: "center" }]}>{block4?.subHeading}</Text>
            <Text style={{ fontSize: 12, fontWeight: 400, color: "rgba(0, 0, 0, 1)", textAlign: "center", lineHeight: 20, fontFamily: "Work Sans" }}>Experience the private unveiling of Altaira - a curated livestream revealing the master vision, architecture, and philosophy behind the destination.</Text>
            <TouchableOpacity onPress={() => {
                navigation.navigate(block4?.screen, {liveStreamUrl: block4?.liveStreamUrl})
            }} style={styles.ctaButton}>
              <Text style={styles.ctaText}>{block4?.button} →</Text>
            </TouchableOpacity>
          </View>
        )}

        {!block5?.hide && (
          <View style={styles.section1}>
            <Text style={[styles.sectionTitle]}>{block5?.heading.toUpperCase()}</Text>
            <ImageBackground source={{ uri:block5?.logo}} style={{ height: 200, width: '100%', borderRadius: 10, alignItems: "center" }} imageStyle={styles.imageStyle}>
              <View style={{position:'absolute',top:35,alignItems:'center'}}>
                <Text style={{fontFamily:'WorkSans-Medium',fontSize:14,color:'#FFF'}}>Altaira Unveiled</Text>
              </View>
              <TouchableOpacity onPress={()=> navigation.navigate("PdfViewerScreen", {url : block5?.conceptPlan})} style={{ top: 145, alignItems: "center", backgroundColor: "#FFFFFF33", padding: 10, width: 100,borderRadius:5 }}>
                <Text style={styles.ctaText}>{block5?.button}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}

        {!block6.hide && (
          <View style={styles.section1}>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
              {block6?.heading}
            </Text>

            <Text style={styles.contactDesc}>
              {block6?.subHeading}
            </Text>

            <TouchableOpacity
              style={[
                styles.ctaButton,
                { backgroundColor: "rgba(99, 78, 54, 1)", marginBottom: 20 }
              ]}
              disabled={isUploading}
              onPress={async() => {
                try{
                  const res = await handleEnquiryForm();
                  if(res?.success){
                    setModalVisible(true);
                  }
                }finally{

                }
              }}
            >
              <Text style={styles.ctaText}>{block6?.button}</Text>
              {isUploading && (
                <Animated.View
                  style={[styles.overlayButton, {width: interpolatedWidth}]}
                />
              )}
            </TouchableOpacity>
          </View>
        )}


        <Modal visible={modalVisible} transparent animationType="fade">
            <TouchableOpacity onPress={() => {
                setModalVisible(false);
            }} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ width: width * 0.65, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, }}>
                    <FastImage
                        source={require('../assets/TickAnim.gif')}
                        style={{ width: 90, height: 90, alignSelf: 'center' }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 14, opacity: 0.8, color: '#000000', textAlign: 'center' }}>
                        Thank You{"\n"}
                        Your Interest submitted successfully. Our team will contact you soon.
                    </Text>

                    <TouchableOpacity onPress={() => {
                        setModalVisible(false);
                    }} style={{ backgroundColor: 'rgba(99, 78, 54, 1)', borderRadius: 13, padding: 7, alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 16, color: '#FFFFFF' }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>



      </ScrollView>
    </SafeAreaView>
  );
};

export default AltairaExperience;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  /* ================= HERO (BLOCK 1) ================= */
  heroContainer: {
    height: 420,
    backgroundColor: "#000",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },

  overlayButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
    },

  backBtn: {
    position: "absolute",
    top: -220,
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#E5E7EB",
    maxWidth: "90%",
  },

  heroContainer: {
    height: 420,
    backgroundColor: "#000",
  },

  heroMedia: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },

  backBtn: {
    position: "absolute",
    top: -220,
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#E5E7EB",
  },
  /* ================= SECTION COMMON ================= */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  section1: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center"
  },

  sectionTitle: {
    fontSize: 16,
    letterSpacing: 1.8,
    color: "rgba(7, 38, 67, 0.65)",
    // fontWeight: "600",
    marginBottom: 8,
    fontFamily: "Work Sans-SemiBold"
  },

  sectionCenterTitle: {
    textAlign: "center",
  },
  /* ================= PROPERTY HIGHLIGHTS (BLOCK 2) ================= */
  highlightImageStyle: {
    borderRadius: 10,
  },

  // imageShade: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.35)", // soft fade
  //   borderRadius: 10,
  // },
  highlightImageBg: {
    width: 190,
    height: 135,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#000",
    marginRight: 5,
  },
  highlightImageStyle: {
    borderRadius: 10,
  },

  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  imageTextContainer: {
    padding: 16,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    fontFamily: "Cormorant Garamond"
  },
  imageDesc: {
    fontSize: 9,
    lineHeight: 8,
    color: "#E5E7EB",
  },

  /* ================= EXPERIENCE (BLOCK 3) ================= */
  experienceTitle1: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
    fontFamily: "Cormorant Garamond",
    textAlign: "center"
  },

  experienceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(231, 210, 173, 0.15)", // earthy luxury tone
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "#111827",
  },
  textWrapper: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(99, 78, 54, 1)",
    marginBottom: 6,
  },
  experienceDesc: {
    fontSize: 11,
    lineHeight: 21,
    color: "#6B7280",
    fontWeight: 400
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 62,
  },
  /* ================= CTA / BUTTONS (BLOCK 4,5,6) ================= */
  ctaButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: 170
  },
  ctaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  /* ================= BLOCK 5 (CONCEPT / BRANDING) ================= */
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logoImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  logoSubText: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#6B7280",
  },
  imageStyle: {
    borderRadius: 10, // Apply the border radius to the image itself
  },

  /* ================= FINAL CTA SPACING ================= */
  bottomSpace: {
    height: 40,
  },
  contactDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Work Sans",
    marginVertical: 6,
  },

});

