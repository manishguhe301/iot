import { useState, useEffect, useRef } from 'react';

const App = () => {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef();

  const onFileChange = (event) => {
    setFiles([...event.target.files]);
    setCurrentFile(URL.createObjectURL(event.target.files[0]));
    setCurrentIndex(0);
  };

  const onEnded = () => {
    if (currentIndex < files.length - 1) {
      setCurrentFile(URL.createObjectURL(files[currentIndex + 1]));
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentFile(URL.createObjectURL(files[0]));
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const savedFile = localStorage.getItem('currentFile');
    const savedTime = localStorage.getItem('currentTime');
    if (savedFile) {
      setCurrentFile(savedFile);
      audioRef.current.currentTime = savedTime;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentFile', currentFile);
    localStorage.setItem('currentTime', audioRef.current.currentTime);
  }, [currentFile]);

  return (
    <div className='container'>
      <div className='audio-player'>
        <input
          type='file'
          accept='audio/*'
          multiple
          onChange={onFileChange}
          className='mb-4 p-4 bg-white rounded-lg shadow-md'
        />
        <audio
          controls
          ref={audioRef}
          src={currentFile}
          onEnded={onEnded}
          autoPlay
          className='w-full mb-4'
        />
        <div className='flex flex-col space-y-2 playlist'>
          {files.map((file, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentFile(URL.createObjectURL(file));
                setCurrentIndex(index);
              }}
              className={`p-4 border rounded ${
                index === currentIndex ? 'active' : ''
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
