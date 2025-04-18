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
      accessKeyId:  process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
      region: 'us-east-1'
    });

    const videoParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: file.name,
      Body: file,
    };

    const thumbnailParams = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
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