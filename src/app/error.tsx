'use client';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-destructive">
          Unable to Load Dashboard
        </h1>
        <p className="text-muted-foreground">
          There was an error loading your dashboard data. Please try refreshing
          the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
