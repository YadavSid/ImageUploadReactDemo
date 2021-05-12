import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

import './App.css';

let coordinates = [], fileName

function callApi(file) {
    fetch(`http://localhost:9000/writeToFile?dir=${fileName}&filename=${file}`,{
        method:"POST",
        body: JSON.stringify(coordinates),
        headers: {
            "Content-Type": "application/json"
        }
    })
}
function writeToFile(buttonId){
    if(buttonId == "b1"){
        callApi('left');
    }
    else if(buttonId == "b2"){
        callApi('right')
    }
    else {
        callApi('diagonal')
    }
}

function onClick(e){
    writeToFile(e.target.id);
    coordinates = [];
}

const UploadComponent = props => (
    <div>
    <form>
        <ImageUploader
            key="image-uploader"
            withIcon={true}
            singleImage={true}
            withPreview={true}
            label="Maximum size file: 5MB"
            buttonText="Choose an image"
            onChange={props.onImage}
            imgExtension={['.jpg', '.png', '.jpeg']}
            maxFileSize={5242880}
        ></ImageUploader>
		<p>X:<span id="x"></span>&nbsp;&nbsp;&nbsp;&nbsp;Y:<span id="y"></span></p>
    </form>
    <button id="b1" class='button' onClick={onClick}>Left Lung</button>
    <button id="b2" class='button' onClick={onClick}>Right Lung</button>
    <button id="b3" class='button' onClick={onClick}>Diagonal</button>
    </div>
);

const App = () => {
    const [progress] = useState('getUpload');
    const [url] = useState(undefined);
    const [errorMessage] = useState('');
	let chestImg = null

    const onImage = async (failedImages, successImages) => {
		document.querySelectorAll('.point').forEach(e => e.remove());
        coordinates = []
		chestImg = document.getElementsByClassName('uploadPicture')
        fileName = chestImg[0].src.split(';')[1].split('=')[1].split('.')[0];
		chestImg[0].onmousedown = GetCoordinates;
	};

    const content = () => {
        switch (progress) {
            case 'getUpload':
                return <UploadComponent onImage={onImage} url={url} />;
            case 'uploading':
                return <h2>Uploading....</h2>;
            case 'uploaded':
                return <img src={url} alt="uploaded" />;
            case 'uploadError':
                return (
                    <>
                        <div>Error message = {errorMessage}</div>
                        <UploadComponent url={url} />
                    </>
                );
        }
    };

    function FindPosition(oElement){
		if(typeof( oElement.offsetParent ) != "undefined"){
			for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent){
				posX += oElement.offsetLeft;
				posY += oElement.offsetTop;
			}
			return [ posX, posY ];
		} else {
			return [ oElement.x, oElement.y ];
		}
    }

    function GetCoordinates(e)
    {
		var PosX = 0;
		var PosY = 0;
		var ImgPos;
		ImgPos = FindPosition(chestImg[0]);
		if (!e) var e = window.event;
		if (e.pageX || e.pageY){
			PosX = e.pageX;
			PosY = e.pageY;
		}
    	else if (e.clientX || e.clientY) {
			PosX = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			PosY = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
        }
		PosX = PosX - ImgPos[0];
		PosY = PosY - ImgPos[1];
		document.getElementById("x").innerHTML = PosX;
		document.getElementById("y").innerHTML = PosY;
        coordinates.push({PosX,PosY})
		let mouseX = e.pageX;
        let mouseY = e.pageY;
		let div = document.createElement("div")
		div.style.width="5px";div.style.position="absolute";div.style.height="5px";div.style.top=mouseY+'px';
		div.style.left=mouseX+'px';div.style.background="#FFFFFF";div.style.borderRadius='5px';
		div.className="point"
        document.getElementsByTagName('body')[0].appendChild(div)
    }

    return (
        <div className="App">
            <h1>Image Upload Website</h1>
            {content()}
        </div>
    );
};

export default App;
