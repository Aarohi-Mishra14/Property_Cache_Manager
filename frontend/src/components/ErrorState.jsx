export default function ErrorState({ message = 'Unable to load data. Please try again.', onRetry }) {
    return (
        <div className="state-message" role="alert">
            <div className="state-message-title">Something went wrong</div>
            <div>{message}</div>
            {onRetry && (
                <button type="button" className="btn btn-secondary" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}
