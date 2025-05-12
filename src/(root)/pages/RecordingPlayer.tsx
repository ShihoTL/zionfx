import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RecordingPlayer = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();

  const decodedUrl = url ? decodeURIComponent(url) : null;

  // Prevent scroll on mount, restore on unmount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!decodedUrl) return <p>No recording URL provided.</p>;

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[100] bg-black p-4 flex flex-col items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="text-white mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        ← Back
      </button>
      <video
        src={decodedUrl}
        controls
        autoPlay
        className="w-full max-w-4xl rounded shadow-lg"
      />
    </div>
  );
};

export default RecordingPlayer;