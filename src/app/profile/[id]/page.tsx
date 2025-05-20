// src/app/profile/[id]/page.tsx
import type { Metadata } from "next";

// Use this type to match Next.js's expected PageProps
type NextPageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

/**
 * UserProfile Component
 *
 * Displays a user profile page with dynamic metadata and responsive design.
 *
 * @param {Object} props - Component props
 * @param {Object|Promise} props.params - Route parameters (may be wrapped in Promise)
 * @returns {Promise<JSX.Element>} The rendered profile page
 */
export async function generateMetadata({
  params,
}: NextPageProps): Promise<Metadata> {
  // Handle both direct params and Promise-wrapped params
  const resolvedParams = params instanceof Promise ? await params : params;
  const userName =
    resolvedParams.id.charAt(0).toUpperCase() + resolvedParams.id.slice(1);

  return {
    title: `${userName}'s Profile | NextAuth`,
    description: `View ${userName}'s profile information`,
    openGraph: {
      title: `${userName}'s Profile`,
      description: `Professional profile of ${userName}`,
    },
  };
}

export default async function UserProfile({ params }: NextPageProps) {
  // Handle both direct params and Promise-wrapped params
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;
  const userInitial = id.charAt(0).toUpperCase();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <section className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">User Profile</h1>

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl font-bold text-black">
            {userInitial || "U"}
          </span>
        </div>

        <p className="text-lg text-gray-300 mb-4 text-center">
          Welcome to your profile page!
        </p>

        <div className="w-full flex flex-col items-center mt-4">
          <span className="text-gray-400 text-sm mb-2">Your Unique ID</span>
          <span className="w-full px-4 py-2 rounded-lg bg-orange-500 text-black font-mono text-center text-base break-all shadow">
            {id}
          </span>
        </div>
      </section>

      <footer className="mt-8 text-center text-gray-500 text-xs">
        Developed by Mohammad Meezan &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
