export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-[#b2784a] focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-[#b2784a] focus:outline-none focus:ring-2 focus:ring-[#b2784a] rounded-lg text-gray-800"
        />
        <button className="w-full bg-[#b2784a] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#59371c] transition">
          Log In
        </button>
      </form>
    </div>
  );
}
