export default async function uploadFile(files) {
    console.log(files);
    const formData = new FormData();
    for (const file of files) {
        formData.append('file', file);
    }
    const option = {
        method: 'post',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
    }
    return await fetch('./storage/uploadFile', option)
        .then(res => {
            if (res.ok)
                return res.json();
            return res.json().then(err => {
                throw new Error(err.message);
            })
        }).catch(err => console.log(err))
}