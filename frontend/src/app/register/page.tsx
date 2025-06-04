export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Account</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
        />
        <button className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}
