import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <section className="h-screen overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <SignUp />
        </div>

        <div className="relative h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
