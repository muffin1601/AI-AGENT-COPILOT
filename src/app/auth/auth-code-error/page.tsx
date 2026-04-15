export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
      <p className="mt-2 text-zinc-600">
        We couldn't finalize your session. This usually happens if your 
        <strong> Supabase Anon Key</strong> is missing or incorrect in your .env file.
      </p>
      <a 
        href="/login" 
        className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Return to Login
      </a>
    </div>
  );
}
