import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, toggleBookmark, fetchComments } from '../redux/videoSlice';
import VideoOverlay from './VideoOverlay';
import CommentBottomSheet from './CommentBottom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function VideoCard({ video, isActive }) {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.videos.comments[video.id] || []);
  const commentLoading = useSelector((state) => state.videos.commentLoading[video.id]);
  const [showComments, setShowComments] = useState(false);

  const onView = () => {
    if (videoRef.current && isActive) {
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
    } else if (videoRef.current && !isActive) {
      videoRef.current.pause();
    }
  };

  const targetRef = useIntersectionObserver(onView, { threshold: 0.6 });

  useEffect(() => {
    if (isActive) onView();
  }, [isActive]);

  const handleLike = () => dispatch(toggleLike(video.id, video.userLiked));
  const handleBookmark = () => dispatch(toggleBookmark(video.id, video.userBookmarked));
  const handleOpenComments = () => {
    if (!comments.length && !commentLoading) dispatch(fetchComments(video.id));
    setShowComments(true);
  };

  const videoUrl = `http://localhost:5000/uploads/${video.file_path.split('/').pop()}`;

  return (
    <div ref={targetRef} className="relative h-full w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <VideoOverlay
        video={video}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onComment={handleOpenComments}
      />
      <CommentBottomSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={video.id}
        comments={comments}
        isLoading={commentLoading}
      />
    </div>
  );
}
