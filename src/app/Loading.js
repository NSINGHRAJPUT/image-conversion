import "./globals.css";

const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="h-screen absolute top-0 z-10 right-0 left-0 bottom-0 w-screen bg-gray-600 opacity-90 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default Loading;
