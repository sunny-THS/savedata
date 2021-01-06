async function openFile(fileName, urlFile) {
  // const url_docs = 'https://drive.google.com/gview?embedded=true&url=';
  const splitFileName = fileName.split('.');
  const typeFile = splitFileName[splitFileName.length-1];
  // if (typeFile == 'cpp') {
  //   location.href = fileName;
  // }else {
  //   location.href = urlFile;
  // }
    location.href = urlFile;
}
