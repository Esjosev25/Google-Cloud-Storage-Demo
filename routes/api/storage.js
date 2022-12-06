
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();



const storage = new Storage();
//upload file
router.post('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name');

  try {
    const bucketName = 'vision-bucket-arca';
    const generationMatchPrecondition = 0;
    const options = {
      destination: name,
    };

    await storage.bucket(bucketName).upload(`./inputs/${name}`, options);
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
//download file
router.get('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name')
  try {
    const options = {
      destination:  './outputs/'+name,
    };
    // Downloads the file
    await storage.bucket(bucketName).file(name).download(options);
    res.send(`gs://${bucketName}/${name} downloaded to ${'./outputs/cloudStorage' + name}.`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }

});
//move file
router.put('/file', async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).send('please send a name')
  try {
    const moveOptions = {
      preconditionOpts: {
        ifGenerationMatch: 0,
      },
    };
    console.log('hola')
    await storage
      .bucket(bucketName)
      .file(name)
      .move('salida/1/pdf.pdf', moveOptions);
    res.send(`gs://${bucketName}/${name} downloaded to ${'./outputs/cloudStorage' + name}.`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }

});
//rename
router.patch('/file', async (req, res) => {
  const { srcFileName, destFileName } = req.query;
  if (!srcFileName)
    return res.status(400).send('please send a name')
  try {
    await storage.bucket(bucketName).file(srcFileName).rename(destFileName);
    res.send(`gs://${bucketName}/${srcFileName} renamed to gs://${bucketName}/${destFileName}.`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }

});

//get metadata
router.get('/metadata', async (req, res) => {
  // const { srcFileName, destFileName } = req.query;
  // if (!srcFileName)
  //   return res.status(400).send('please send a name')
  // try {
  //   const [metadata] = await storage.bucket(bucketName).getMetadata();  
  //   res.send(`gs://${bucketName}/${srcFileName} renamed to gs://${bucketName}/${destFileName}.`)
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).send(error)
  // }

});

//post file on stream
router.post('/stream', async (req, res) => {
  

});
module.exports = router;