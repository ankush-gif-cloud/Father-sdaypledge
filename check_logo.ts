import https from 'https';
https.get('https://www.adda247.com/images/adda247-logo.svg', (res) => {
  console.log('SVG:', res.statusCode);
});
https.get('https://www.adda247.com/images/logo.png', (res) => {
  console.log('PNG:', res.statusCode);
});
https.get('https://www.adda247.com/assets/images/logo.png', (res) => {
  console.log('PNG2:', res.statusCode);
});
https.get('https://yt3.googleusercontent.com/ytc/AIdro_kx7C2tZlH56d-eK_-TqI2yE3b6s49M7H6yQ5k5tGg0u2k=s900-c-k-c0x00ffffff-no-rj', (res) => {
  console.log('YOUTUBE:', res.statusCode);
});
