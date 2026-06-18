
// components/ui/CollabBoardLogo.tsx
export function CollabBoardLogo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
        <div className="absolute inset-[3px] bg-white rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">CB</span>
        </div>
      </div>
      <span className="text-xl font-bold text-gray-900">
        Collab<span className="text-blue-600">Board</span>
      </span>
    </div>
  );
}