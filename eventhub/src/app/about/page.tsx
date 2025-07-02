'use client';

export default function AboutPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">About EventHub</h1>
      <p className="text-lg text-[#59371c] mb-6">
        Welcome to <strong>EventHub</strong>, your one-stop platform for creating, managing, and attending events. Whether you're hosting a small gathering or a large conference, EventHub makes it easy to organize and connect with attendees.
      </p>
      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
      <p className="text-lg text-[#59371c] mb-6">
        At EventHub, our mission is to empower individuals and organizations to create memorable experiences. We aim to simplify event management and provide tools that make hosting and attending events seamless and enjoyable.
      </p>
      <h2 className="text-2xl font-bold mb-4">Features</h2>
      <ul className="list-disc pl-6 text-lg text-[#59371c] mb-6">
        <li>Create and customize events with ease.</li>
        <li>Manage attendees and track registrations.</li>
        <li>Explore events and book tickets effortlessly.</li>
        <li>Stay updated with event details and notifications.</li>
      </ul>
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <p className="text-lg text-[#59371c] mb-6">
        Have questions or need assistance? Feel free to reach out to us at <strong>support@eventhub.com</strong>. We're here to help!
      </p>
      <p className="text-lg text-[#59371c]">
        Thank you for choosing EventHub. Let's make your events unforgettable!
      </p>
    </div>
  );
}