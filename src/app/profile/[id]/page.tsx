interface UserProfileProps {
  params: { id: string };
}

export default function UserProfile({ params }: UserProfileProps) {
  const id = params.id;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-lg p-10 border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">User Profile</h1>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl font-bold text-black">
            {id.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <p className="text-lg text-gray-300 mb-2">
          Welcome to your profile page!
        </p>
        <div className="flex flex-col items-center mt-4">
          <span className="text-gray-400 text-sm mb-1">User ID</span>
          <span className="px-4 py-2 rounded-lg bg-orange-500 text-black font-mono text-base break-all shadow">
            {id}
          </span>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
