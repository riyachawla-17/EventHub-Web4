import Link from 'next/link';
import UserDashboard from '../components/UserDashboard';

export default function Home() {
  return (
    
    <>
      <header>
        <h1>EventHub</h1>
        <nav>
          <a href="/login">Login</a>  <br></br> <br></br>
          <a href="/register">Register</a>
        </nav>
      </header>
       <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      
     

      <main className="container">
        <h2>Discover Tech Events, Hackathons & Meetups</h2>
        <p>Join the most exciting tech community around you 🚀</p>
      </main>
    </>
    
  );
}

export function DashboardPage() {
    return (
      <div className="dashboard">
        <UserDashboard />
      </div>
    );
  } 
