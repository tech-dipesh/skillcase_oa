import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, setCurrentIndex } from '../redux/videoSlice';
import { fetchMe } from '../redux/authSlice';
import VideoCard from '../components/Videocard';
import LoadingSpinner from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed() {
  const dispatch = useDispatch();
  const { videos, isLoading, error, currentVideoIndex } = useSelector((state) => state.videos);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchVideos());
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      dispatch(setCurrentIndex(newIndex));
    }
  }, [currentVideoIndex, videos.length, dispatch]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (containerRef.current && currentVideoIndex >= 0) {
      containerRef.current.scrollTo({
        top: currentVideoIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]);

  if (isLoading && videos.length === 0) return <LoadingSpinner />;
  if (error) return <div className="text-white text-center mt-8">{error}</div>;

  if (videos.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">🎬</span>
          <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
          <p className="text-gray-400">Check back later for new content</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      <AnimatePresence>
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            className="h-screen w-full snap-start relative bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoCard video={video} isActive={idx === currentVideoIndex} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
