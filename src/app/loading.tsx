const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-6">
          <div className="w-40 h-6 bg-muted rounded animate-pulse" />
          <div className="ml-auto flex items-center space-x-4">
            <div className="w-48 h-4 bg-muted rounded animate-pulse" />
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-32 h-8 bg-muted rounded animate-pulse" />
            <div className="w-80 h-4 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-9 bg-muted rounded animate-pulse" />
            <div className="w-32 h-9 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="space-y-2">
                <div className="w-28 h-4 bg-muted rounded animate-pulse" />
                <div className="w-12 h-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Frequent Flyer Programs Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="w-52 h-7 bg-muted rounded animate-pulse" />
            <div className="w-96 h-4 bg-muted rounded animate-pulse" />
          </div>

          {/* Stats Tabs */}
          <div className="flex space-x-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-4 bg-muted rounded animate-pulse"
              />
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="w-12 h-4 bg-muted rounded animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="w-12 h-4 bg-muted rounded animate-pulse" />
              <div className="w-24 h-9 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex items-center justify-between">
            <div className="w-64 h-9 bg-muted rounded animate-pulse" />
            <div className="w-20 h-9 bg-muted rounded animate-pulse" />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {/* Table Header */}
            <div className="border-b bg-muted/50 p-4">
              <div className="grid grid-cols-6 gap-4">
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse mb-4" />
              <div className="w-32 h-5 bg-muted rounded animate-pulse mb-2" />
              <div className="w-48 h-4 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between">
            <div className="w-32 h-4 bg-muted rounded animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                <div className="w-12 h-8 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
              <div className="flex space-x-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
