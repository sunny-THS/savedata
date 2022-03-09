export default function createElFormFile(infoFiles) {

    let bodyContent = document.querySelector('#bodyContent');

    while (bodyContent.hasChildNodes()) {
        bodyContent.removeChild(bodyContent.firstChild)
    }
    
    // setup show item file
    infoFiles.forEach(item => {
        let col = document.createElement('div');
        col.setAttribute('class', 'col');

        let itemFile = document.createElement('div');
        itemFile.setAttribute('class', 'itemFile text-center');

        let iconFile;
        switch(item.type) {
            case 'image/jpeg': case 'image/png': { // show image file
                iconFile = 'image';
            }break;
            case 'application/pdf': {
                iconFile = 'file-pdf';
            }break;
            case 'application/octet-stream': case 'application/vnd.rar': { // .rar file
                iconFile = 'file-archive';
            } break;
            case 'text/csv': {
                iconFile = 'file-csv';
            } break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                iconFile = 'file-excel';
            } break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                iconFile = 'file-word';
            } break;
            default: {
                iconFile = 'file';
            };
        }
        itemFile.innerHTML = `<i class="fa fa-${iconFile} me-2"></i>${item.name}`;

        if (item.size != 0) { // evt click on file
            itemFile.addEventListener('click', async (e) => {
                await getFile(`${sessionStorage.getItem('username')}/${item.name}`)
                    .then(rs => {
                        window.open(rs, '_blank')
                    });
            });
        }
        itemFile.setAttribute('title', item.name);
        
        col.appendChild(itemFile);
        bodyContent.appendChild(col)
    });
}

async function getFile(pathName) {
    return await fetch('./storage/getFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({
            pathName: pathName
        })
    })
    .then(res => {
        if (!res.ok)
            throw new Error(res.statusText);
        return res.json();
    })
    .catch(error => {
        throw error;
    })
}