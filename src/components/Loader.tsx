const Loader = () => (
    <div
      className="loader-container fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="status"
      aria-label="Loading"
    >
      <div className="loader w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  
  export default Loader
  