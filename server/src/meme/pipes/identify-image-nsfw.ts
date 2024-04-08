const identifyImageNsfw = async (file: Express.Multer.File) => {
  const jpegBytes = file.buffer.toString('base64');
  const ENDPOINT = 'http://localhost:8501/v1/models/private_detector:predict';
  const predictRequest = { instances: [{ b64: jpegBytes }] };

  return await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(predictRequest),
  })
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      return data.predictions[0][0];
    })
    .catch((error) => console.error('Error making prediction request:', error));
};

export default identifyImageNsfw;
