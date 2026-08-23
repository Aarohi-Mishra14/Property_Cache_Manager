// Used for errors that happen during a specific action (saving, deleting,
// clearing a cache entry) where the rest of the page's data is still good
// and shouldn't be replaced by a full-page error state.
export default function InlineAlert({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="inline-alert" role="alert">
            <span>{message}</span>
            <button type="button" onClick={onDismiss} aria-label="Dismiss error message">
                Dismiss
            </button>
        </div>
    );
}
