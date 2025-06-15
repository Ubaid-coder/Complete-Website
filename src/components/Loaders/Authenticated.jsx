
function Authenticated() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center px-4">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-pulse">
                <h2 className="text-white text-2xl font-semibold mb-4">🔐 Checking Authentication...</h2>
                <p className="text-sm text-gray-300 mb-6">
                    You are logged in, redirecting you to your dashboard.
                </p>
                <div className="w-16 h-16 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default Authenticated