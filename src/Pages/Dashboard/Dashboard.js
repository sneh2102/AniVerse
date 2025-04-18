import React, { useEffect, useState , useContext} from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import {useNavigate,useLocation} from 'react-router-dom';
import useVideo from '../../Hooks/useVideo';
import useAuth from '../../Hooks/useAuth';



const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const {logout,setStatus} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const[role,setRole] = useState('user');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const {fetchVideos,searchVideo} = useVideo();
  const [searchTerm, setSearchTerm] = useState('');
  const {fetchUserDetails} = useAuth();

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
   const email = window.localStorage.getItem('email');
   console.log('Email:',email);
    fetchUserDetails({email: email}).then((data)=>{
      setRole(data.body.result.Item.role);
    }).catch((err)=>{
      console.log('Error:',err);
    });
    const fetchData = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch (err) {
        console.log('Error:', err);
      }
    };
    fetchData();
  }, []);


  const handleThumbnailClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleSearch = () => {
    const searchDetails = {
      fieldValue: searchTerm
    }
      searchVideo(searchDetails).then((data)=>{
      setVideos(data);
    }).catch((err)=>{
      console.log('Error:',err);
    });
  };

  return (
    <>
      <div className="App">
        <header className="dark-mode">
          <div className="logo-search">
            <h1 className="dark-mode flicker">Aniverse</h1>
            <input
              className='search-bar'
              type="text"
              placeholder="Search movies..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="user-actions">
            <ul>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              {role === 'admin' ?
              <>
              <li>
                <Link to="/upload">Upload</Link>
              </li>
              </>:null
                }
              <li
                onClick={() => {
                  logout();
                  setStatus(false);
                  navigate("/");
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        </header>
        {selectedVideo && (
          <div className="video-overlay">
            <div className="video-player">
            <p>{selectedVideo.title}</p>
              <video controls autoPlay>
                <source
                  src={`${process.env.REACT_APP_S3_LINK}/${selectedVideo.vKey}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <button onClick={handleCloseVideo}>Close</button>
            </div>
          </div>
        )}
        <main>
        <div
        className="movie-container"
        >
          {videos && videos.map((video, index) => (
              <div className="movie-card"
              key={index}
              onClick={() => handleThumbnailClick(video)}
              >

                <img
                  src={`${process.env.REACT_APP_S3_LINK}/${video.tKey}`}
                  alt={video.title}
                />
                <h2>{video.title}</h2>
              </div>
          ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
