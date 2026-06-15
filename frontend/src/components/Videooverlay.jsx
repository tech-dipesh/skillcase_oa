import { motion } from 'framer-motion';

export default function VideoOverlay({ video, onLike, onBookmark, onComment }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex justify-between items-end text-white">
      <div>
        <h3 className="text-xl font-bold">{video.title}</h3>
        <p className="text-sm opacity-80">{video.description}</p>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onLike} className="flex flex-col items-center gap-1">
          <span className="text-3xl">{video.userLiked ? '❤️' : '🤍'}</span>
          <span className="text-xs">{video.like_count}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onComment} className="flex flex-col items-center gap-1">
          <span className="text-3xl">💬</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBookmark} className="flex flex-col items-center gap-1">
          <span className="text-3xl">{video.userBookmarked ? '🔖' : '📑'}</span>
        </motion.button>
      </div>
    </div>
  );
}
