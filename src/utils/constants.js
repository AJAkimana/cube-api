const skyboxImages = [
  'evening_bridge.jpg',
  'evening_in_the_6.jpg',
  'forest_tree.jpg',
  'lakeview_sunset.jpg',
  'milkyway.jpg',
  'mountain_sunrise.jpg',
  'studio.jpg',
];

const customArBtnImages = [
  'blackwhite.png',
  'lightgrey.png',
  'spacegrey.png',
  'wallblack.png',
  'walllightgrey.png',
  'wallspacegrey.png',
  'wallwhite.png',
  'white.png',
];

export default defaultImages = [
  ...skyboxImages.map((img) => ({
    imageType: 'skybox',
    imageFileName: img,
  })),
  ...customArBtnImages.map((img) => ({
    imageType: 'custom',
    imageFileName: img,
  })),
];
