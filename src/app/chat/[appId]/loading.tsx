export default function ChatLoading() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Header skeleton */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0 bg-white/80">
        <div className="w-8 h-8 rounded-lg bg-gray-100" />
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-gray-100" />
          <div className="w-48 h-4 rounded bg-gray-100" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* User message */}
          <div className="flex justify-end">
            <div className="w-64 h-12 rounded-2xl bg-gray-100" />
          </div>
          {/* AI response */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-3/4 h-4 rounded bg-gray-100" />
              <div className="w-1/2 h-4 rounded bg-gray-100" />
              <div className="w-2/3 h-4 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t border-gray-200 px-6 py-3 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="h-20 rounded-2xl bg-gray-50 border border-gray-200" />
        </div>
      </div>
    </div>
  );
}
