const { storage } = require('../models/firebase');

async function getListFiles(pathId) {
    // Lists files in the bucket
    const [files] = await storage.bucket().getFiles({
        // autoPaginate: false,
        prefix: `${pathId}/`,
        // delimiter: '/'
    });
    return files;
}

const storageController = {
    getStorage: async (req, res) => {
        await getListFiles(req.body.user.name)
            .then(item => {
                const data = item.map(file => {
                    const infoFile = file.metadata;
                    let nameFile = infoFile.name.replace(`${req.body.user.name}/`, '');

                    return {
                        name: nameFile,
                        type: infoFile.contentType,
                        size: infoFile.size,
                        path: `${req.body.user.name}/`,
                        generation: infoFile.generation,
                        timeCreated: infoFile.timeCreated
                    };
                })
                if (data.length == 0)
                    throw new Error('Not Found!');
                res.json(data);
            })
            .catch(err => {
                res.status(404).json({
                    message: err.message
                });
            });
    },
    saveFiles: async (req, res, next) => {
        const amountFiles = await req.files.file.length;
        var countFile = 0;
        
        const files = amountFiles === undefined ? [await req.files.file] : await req.files.file;
        const contentFile = files.map(file => {
            const data = { 
                name: file.name, 
                type: file.mimetype 
            };
            return data;
        });

        Array.prototype.forEach.call(amountFiles === undefined ? [await req.files.file] : await req.files.file, async (file) => {
            const { name, data } = file;
            console.log(name);
            const blob = await storage.bucket().file(`${req.body.user.name}/${name.replace(/ /g, "_")}`);

            await blob.createWriteStream({
                resumble: false,
                gzip: true
            })
            .on('error', err => {
                next(err);
            })
            .on('finish', async () => {
                console.log(countFile);
                console.log('File uploaded successfully');
                await storage.bucket().file(`${req.body.user.name}/${name.replace(/ /g, "_")}`).makePublic()
                if (amountFiles == undefined || ++countFile == amountFiles)
                    res.json({
                        message: 'File uploaded successfully',
                        data: contentFile
                    });
            })
            .end(data); // send file to storage
        });
    },
    getFile: async (req, res) => {
        res.json(await storage.bucket().file(req.body.pathName).publicUrl());
    },
}

module.exports = storageController;