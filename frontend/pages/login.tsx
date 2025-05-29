import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    <main className="container">
      <h2>Login to EventHub</h2>
      <form>
        <input type="email" placeholder="Email" /> <br></br>
        <input type="password" placeholder="Password" /><br></br>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
