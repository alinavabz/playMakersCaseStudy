import React from "react";
import ReactDOM from "react-dom/client";

// This function is for PNG format only
// Under assumption that the png input has already been loaded
const setBadgePNG = (pngImage) => {
  if (pngImage instanceof Image) {
    if (pngImage.src.toLowerCase().endsWith(".png")) {
      return convertImage(pngImage);
    } else {
      alert("File is not in PNG format");
      return;
    }
  } else {
    alert("File is not an Image");
    return;
  }
};

// This function is the parallel function for all types
//under the assumption that the new object is not PNG
const setBadgeAllTypes = (uploadedImage) => {
  if (uploadedImage instanceof Image) {
    return convertImage(uploadedImage);
  } else {
    alert("File is not an Image");
    return;
  }
};

// This function takes care of size verification
const isImageSizeCorrect = (image, size) => {
  return image.naturalWidth === size && image.naturalHeight === size;
};

// This function gives an alert if there are transparent pixels,
// it only allows non-transparent pixels in the circle
const checkTransparency = (newImg, imageData) => {
  const data = imageData.data;
  const midX = newImg.width / 2;
  const midY = newImg.height / 2;
  const radius = newImg.width / 2;

  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      // This is used to convert a 2D coordinate into a 1D
      const index = (y * newImg.width + x) * 4;
      const distance = Math.sqrt((x - midX) ** 2 + (y - midY) ** 2);
      if (distance < radius && data[index + 3] === 0) {
        alert("There are transparent pixels within the circle.");
        return;
      }
    }
  }
};

// This function gives a rough happy count estimate based on RGB

const checkHappyCount = (imageData, newImg) => {
  const data = imageData.data;
  let happyColorCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    // assumed happy colour have higher ratio of red and lower ratio of blue
    if (red > 150 && 50 < green < 100 && blue < 50) {
      happyColorCount++;
    }
  }
  if (happyColorCount < (newImg.width * newImg.height) / 10) {
    alert('The colors do not give a "happy" feeling.');
    return;
  }
};

//this function converts image to a circle
const convertImage = (uploadedImage) => {
  const size = 512;
  if (isImageSizeCorrect(uploadedImage, size)) {
    const newImg = document.createElement("canvas");
    newImg.width = size;
    newImg.height = size;

    const context = newImg.getContext("2d");
    context.drawImage(uploadedImage, 0, 0);
    const imageData = context.getImageData(0, 0, newImg.width, newImg.height);

    context.globalCompositeOperation = "destination-in";

    context.beginPath();

    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    checkTransparency(newImg, imageData);

    checkHappyCount(imageData, newImg);
    return newImg;
  } else {
    alert("Image is not the correct size");
    return;
  }
};

// If you would like to see the transformed image on the website
// comment out below section and update the path

const img = new Image();
img.src = "wrongSize.png";

img.onload = function () {
  // call below function for all image types
  // document.body.appendChild(setBadgeAllTypes(img));
  // call below function for PNG only
  const newImg = setBadgePNG(img);
  if (newImg) {
    document.body.appendChild(newImg);
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode></React.StrictMode>);
