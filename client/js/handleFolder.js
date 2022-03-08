export default async function loadFolder(accessToken) {
    return await fetch('./storage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
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