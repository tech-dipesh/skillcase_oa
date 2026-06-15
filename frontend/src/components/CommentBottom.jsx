import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postComment } from '../redux/videoSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommentBottomSheet({ isOpen, onClose, videoId, comments, isLoading }) {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await dispatch(postComment(videoId, newComment));
    setNewComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl max-h-[70vh] flex flex-col z-50 text-white"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between">
              <h3 className="font-semibold">Comments</h3>
              <button onClick={onClose} className="text-xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading && <p>Loading...</p>}
              {!isLoading && comments.length === 0 && <p>No comments yet. Be the first!</p>}
              {comments.map(comment => (
                <div key={comment.id}>
                  <strong className="text-primary">{comment.user_name}</strong>
                  <p className="mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="bg-primary px-4 py-2 rounded-full font-semibold">Post</button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
