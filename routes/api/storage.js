const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();



const storage = new Storage({
  keyFilename: 'APIKey.json'
});

router.post('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name');

  try {
    const bucketName = 'vision-bucket-arca';
    const generationMatchPrecondition = 0;
    const options = {
      destination: name,
      preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
    };

    await storage.bucket(bucketName).upload(`inputs/${name}`, options);
    res.send(`${name} uploaded to ${bucketName}`)
  } catch (error) {
    console.error(error);
  }

});
const bucketName = 'vision-bucket-arca'



router.delete('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name')
  const deleteOptions = {
    ifGenerationMatch: 0
  };
  try {
    await storage.bucket(bucketName).file(name).delete();
    res.send(`gs://${bucketName}/${name} deleted`)

  } catch (error) {
    console.error(error);
    res.status(500).send(error)
  }
})

router.get('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name')
  try {
    const options = {
      destination:  name,
    };
    // Downloads the file
    await storage.bucket(bucketName).file(name).download(options);
    res.send(`gs://${bucketName}/${name} downloaded to ${'./outputs/cloudStorage' + name}.`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }

});





module.exports = router;