import React,{ useState } from 'react';
import AWS from 'aws-sdk';
import { useDropzone } from 'react-dropzone';
import './VideoUploadForm.css';
import useVideo from '../../Hooks/useVideo';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const VideoUploadForm = () => {
  const { addVideo } = useVideo();
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const {logout,setStatus} = React.useContext(AuthContext);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: 'video/*',
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setThumbnail(acceptedFiles[0]);
    },
  });

  const handleUpload = () => {
    if (!file || !thumbnail || !title) {
      console.error('Please provide all required fields');
      return;
    }

    const s3 = new AWS.S3({
      accessKeyId: "ASIA6ODU7EGN52SRLYGN" ,
      secretAccessKey: "T/vYjsdGb0pcwkQfJrxynaKcK2bmhkJb5vlcN3vS",
      sessionToken: "IQoJb3JpZ2luX2VjEN7//////////wEaCXVzLXdlc3QtMiJIMEYCIQCdlC2SfesUy5Ox+zlO5eNlglvr19G2Qr+xm+yris0LzwIhALcE8/gQZUK9VHZtSSqM6SG+62FVtFyZjpUzO5HO5Jd+KqkCCBcQABoMOTkyMzgyNzU1MjI3IgwXubT5IKJhC8TjFMoqhgJC7pEPd4AS/g61umosYK4xUVNAQXkL16jwrT5XMxza8HNhZ+OyTwgwNMBgY4qwW0YCJxGjYxUlYAd/PYWwlicBG4uCKj3x1Go9qYleYqKXNm43JVs9cstBZleozwVaBFSJA4lbxzZW/D4OPwU6i82KKEihZSMls90f/IRTiP7M3iYa01JFxntEXtzhCFQuD94UqBihbAz3AJy4YdZomQX0x0XW9m3QcMo6EZ6CDv8SFWkhfNbpOKj8Atq34iNIgGOhAoKQpxWdY8psi2l18BsahxhtAx3aKb5BU1xXwIsB78Feke4WZdulpRQHUggqvZ77SGsGttTJQOclzm8FZHN4RFi0Hn8CMPuI1bAGOpwBrb06zzxmHAQvwQY+S3Dkc3tnQs/N94G+IAXzSRdBWA3jSGTEGvh6lARY0AUtzt0nRASSWiYdukIZeMjedUvs2+TZ6UuemaZYvJp9j3+J3zDJcxNynjX669r7k1jpv/9kxVYqHk4vi84SlO9psrmiLCtOtOxFCb69vJUO30/mdiViVzn5yr0Vdf5ii6yh+28Q9HKk7uHQ02YZ7MZx",
      region: 'us-east-1'
    });

    const videoParams = {
      Bucket: 'b00968316-aniverse-bucket',
      Key: file.name,
      Body: file,
    };

    const thumbnailParams = {
      Bucket: 'b00968316-aniverse-bucket',
      Key: `thumbnails/${thumbnail.name}`,
      Body: thumbnail,
    };
    toast.promise(
    Promise.all([
      s3.upload(videoParams).promise(),
      s3.upload(thumbnailParams).promise(),
    ])
      .then((data) => {
        addVideo({ title, vKey: data[0].Key, tKey: data[1].Key });
        
      })
      .catch((err) => {
        console.error('Error uploading files:', err);
      }),{
        loading: 'Uploading files...',
        success: 'Files uploaded successfully',
        error: 'Failed to upload files',
      }
    );
  };

  return (
    <>
      <header className="dark-mode">
        <div className="logo-search">
        <h1 className="dark-mode flicker">Aniverse</h1>
        
        </div>
        <div className="user-actions">
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li onClick={()=>{
              logout();
              setStatus(false);
              navigate('/');
            }}>Logout</li>
            
            </ul>
    </div>
      </header> 
    <div className="upload-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          />
      </div>
      <div {...getVideoRootProps()} className="dropzone">
        <input {...getVideoInputProps()} />
        {file ? (
          <div>
            <p>{file.name}</p>
            <video src={URL.createObjectURL(file)} controls />
          </div>
        ) : (
          <p>Drag and drop video file here, or click to select</p>
        )}
      </div>
      <div {...getThumbnailRootProps()} className="dropzone">
        <input {...getThumbnailInputProps()} />
        {thumbnail ? (
          <div>
            <p>{thumbnail.name}</p>
            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" />
          </div>
        ) : (
          <p>Drag and drop thumbnail image here, or click to select</p>
        )}
      </div>
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div>
        </>
  );
};

export default VideoUploadForm;