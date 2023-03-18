
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap'
import {BsPlayCircle, BsStopCircle, BsUpload} from 'react-icons/bs'
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Typography, Box} from '@mui/material';
import PropTypes from 'prop-types';

import "../css/HairColorView.css"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const socket = io.connect('http://localhost:5001/test')
function HairColorView() {
    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const [ hairColor, setHairColor ] = useState({r: "244",g: "67",b: "54",a: "1",})
    const { r, g, b, a } = hairColor;
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [isShowImage, setIsShowImage] = useState(false);
    const [localMediaStream, setLocalMediaStream] = useState(null);
    const [currentInterval, setCurrentInterval] = useState(null);
    const [uploadedFile, setUploadFile] = useState(null);
    const [uploadedFileURL, setUploadFileURL] = useState(null);
    const [downloadedFile, setDownloadedFile] = useState(null);
    const hiddenFileInput = useRef(null);
    const mediaWidth = 300;
    const mediaHeight = 300;
    const constraints = {
        video: {
            width: 300,
            height: 300,
            audio: false,
        }
    };
    const [valueC, setValueC] = React.useState(0);

    const handleChangeC = (event, newValue) => {
        setValueC(newValue);
    };

    const colorList = [
        { key: 0, label: "Smoky Black", hex:"#100C07", rgb: {r: "16", g: "12", b: "7"} },
        { key: 1, label: "Liver", hex:"#5A3825", rgb: {r: "90", g: "56", b: "37"} },
        { key: 2, label: "Brown Yellow", hex:"#CC9966", rgb: {r: "204", g: "153", b: "102"} },
        { key: 3, label: "Indigo", hex:"#580271", rgb: {r: "88", g: "2", b: "113"} },
        { key: 4, label: "Deep Magenta", hex:"#DB02C2", rgb: {r: "219", g: "2", b: "194"} },
        { key: 5, label: "Flirt", hex:"#970572", rgb: {r: "151", g: "5", b: "114"} },
        { key: 6, label: "Fuzzy Wuzzy", hex:"#F78DA7", rgb: {r: "247", g: "141", b: "167"} },
        { key: 7, label: "Crayola's Maize", hex:"#FFCC47", rgb: {r: "255", g: "204", b: "71"} },
        { key: 8, label: "Crayola's Gold", hex:"#E6BE8A", rgb: {r: "230", g: "190", b: "138"} },
        { key: 9, label: "Golden Brown", hex:"#996515", rgb: {r: "153", g: "101", b: "21"} },
        { key: 10, label: "Falu Red", hex:"#801818", rgb: {r: "128", g: "24", b: "24"} },
        { key: 11, label: "Beer", hex:"#FF9321", rgb: {r: "255", g: "147", b: "33"} },
        { key: 12, label: "Metallic Orange", hex:"#DA680F", rgb: {r: "218", g: "104", b: "15"} },
        { key: 13, label: "Blue", hex:"#1273DE", rgb: {r: "18", g: "115", b: "222"} },
        { key: 14, label: "Navy Blue", hex:"#8ED1FC", rgb: {r: "142", g: "209", b: "252"} },
        { key: 15, label: "Green", hex:"#4CAF50", rgb: {r: "76", g: "175", b: "80"} },
        { key: 16, label: "Light Green", hex:"#00D084", rgb: {r: "0", g: "208", b: "132"} },
        { key: 17, label: "Dark Charcoal", hex:"#333333", rgb: {r: "51", g: "51", b: "51"} },
        { key: 18, label: "White", hex:"#FFFFFF", rgb: {r: "255", g: "255", b: "255"} },
        { key: 19, label: "Philippine Silver", hex:"#B8B8B8", rgb: {r: "184", g: "184", b: "184"} },     
    ];

    const [tab, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const startCam = () => {
        clearUploadedFile();
        setIsShowVideo(true);
        socket.on('connect', function() {
            console.log('Connected!');
        });
        
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            videoRef.current.srcObject = stream;
            setLocalMediaStream(stream)
            let fps = 5;
            if (currentInterval){
                clearInterval(currentInterval);
                setCurrentInterval(null);
            }
            setCurrentInterval(setInterval(paintToCanvas, 1000/fps));
        }).catch(function(error) {
            console.log(error);
        });
    }

    const stopCam = () => {
        if (localMediaStream){
            const tracks = localMediaStream.getTracks();
            tracks.forEach(track => track.stop());
            if (currentInterval){
                clearInterval(currentInterval);
                setCurrentInterval(null);
            }
            setIsShowVideo(false);
            axios.get("http://localhost:5001/clear")
        }
    }

    const paintToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
        photo.width = mediaWidth;
        photo.height = mediaHeight;
        ctx.drawImage(video, 0, 0, mediaWidth, mediaHeight);
        let dataURL = photo.toDataURL('image/jpeg');
        socket.emit('input image', { image: dataURL, r:hairColor.r, g:hairColor.g, b:hairColor.b });
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
        stopCam()
    };

    const handleFileChange = (event) => {
        setIsShowImage(true);
        const file = event.target.files[0];
        setUploadFile(file);
        setUploadFileURL(URL.createObjectURL(file));
        processImage(file);
    };

    const processImage = (file)  => {
        const formData = new FormData();
        formData.append('imgFile', file);
        axios.post("http://localhost:5001/image", formData, {params: {r: r, g: g, b: b}})
        .then(res => {
            console.log(res.data);
            if (res.status === 200) {
                let imageBytes = res.data;
                setDownloadedFile(imageBytes);
            }
        })
        .catch(error => console.log(error));
    }

    const onColorChange = (color) => {
        setHairColor(color.rgb);
        if (isShowImage && uploadedFile){
            processImage(uploadedFile)
        } else if (currentInterval){
            clearInterval(currentInterval);
            setCurrentInterval(setInterval(paintToCanvas, 1000/5));
        }
            
    }

    const clearUploadedFile = () => {
        setUploadFile(null);
        setDownloadedFile(null);
        setIsShowImage(false);
    }

    useEffect(()=>{
        return () => URL.revokeObjectURL(uploadedFile)
    }, [uploadedFile])

    return (    
    <>
        <Container fluid className="page-container">    
            <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered value={tab} onChange={handleChange} aria-label="basic tabs example"
                      TabIndicatorProps={{
                        style: {backgroundColor: "white",}
                    }}>
                    <Tab label="❏ Image" className="tab-label"/>
                    <Tab label="❏ Live Action" className="tab-label"/>
                </Tabs>
                </Box>
                <TabPanel value={tab} index={0} className="option-tab">
                    <p className="my-2">Upload an image with people in it and check how their hair color changes</p>
                    <input type="file" accept="image/*" ref={hiddenFileInput} onChange={handleFileChange} onClick={(event)=>{event.target.value = null}} style={{display:'none'}} /> 
                    <Button variant="contained" className='mx-1 start-button' onClick={handleClick} startIcon={<BsUpload />}> Upload an Image</Button>
                </TabPanel>
                <TabPanel value={tab} index={1} className="option-tab">
                    <p className="my-2">See your hair color changes in real time</p>
                    <Button variant="contained"  className='mx-1 start-button' onClick={startCam} startIcon={<BsPlayCircle />}>Start Video Feed</Button>
                    <Button variant="outlined" className='mx-1 stop-button' onClick={stopCam} startIcon={<BsStopCircle />}>Stop Video Feed</Button>
                </TabPanel>
           
            </Container>
            <Container className=''>
                <Divider sx={{
                            "&::before, &::after": {
                                borderColor: "#4DB6AC",
                            }}}>
                    {' '}
                </Divider>
            </Container>
            <Container fluid className="video-container">
                <Row>
                    <Col className="input-col">
                        {isShowVideo &&(<video className="webcam-video" autoPlay={true} ref={videoRef}></video>)}
                        {isShowVideo &&(<canvas ref={photoRef} />)}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} src={uploadedFileURL} />}
                    </Col>
                    <Col className="output-col">
                        {isShowVideo && <img src="http://localhost:5001/video_feed"  alt="transformed_output"></img>}
                        {isShowImage && <img style={{'width': mediaWidth, 'height': mediaHeight}} 
                        src={`data:image/jpeg;base64,${downloadedFile}`} />}
                    </Col>
                </Row>
            </Container>
            <Container className='mt-3'>
                <Divider sx={{
                            "&::before, &::after": {
                                borderColor: "rgba(var(--bs-dark-rgb),var(--bs-bg-opacity))",
                            }}}>
                    <Chip variant="outlined" label="Choose a color" sx={{border: "1px solid"}}/>
                </Divider>
            </Container>
        <Container className="color-picker">   
        <Tabs
            value={valueC}
            onChange={handleChangeC}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
            TabIndicatorProps={{
                style: {
                    backgroundColor: "#FFFFFF"
                }
            }}
            sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0.3 },
                },
            }}
        >
            {colorList.map((data) => (
                <Tab style={{ backgroundColor:data.hex }} 
                    className="color-tab"
                    key={data.key}
                    onClick={() => onColorChange(data)}
              />
            ))}
        </Tabs>
        </Container>
        </Container>
    </>
  );
}

export default HairColorView;