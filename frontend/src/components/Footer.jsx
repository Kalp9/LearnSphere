const Footer = () => (
  <footer className="border-t border-white/10 py-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>© {new Date().getFullYear()} LearnSphere. Built for ambitious learners.</p>
      <p>Secure courses, verified payments, protected access.</p>
    </div>
  </footer>
);

export default Footer;
