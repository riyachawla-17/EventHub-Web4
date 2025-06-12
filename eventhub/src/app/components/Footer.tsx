export default function Footer() {
  return (
    <footer className="bg-[#f8f1eb] text-center text-xs text-[#59371c] py-3 mt-auto">
      © {new Date().getFullYear()} EventHub. All rights reserved.
    </footer>
  );
}