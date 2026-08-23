export default function LoadingState({ message = 'Loading...' }) {
    return (
        <div className="state-message" role="status" aria-live="polite">
            <div className="state-message-title">{message}</div>
        </div>
    );
}
