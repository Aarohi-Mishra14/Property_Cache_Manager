function errorHandler(err, req, res, next) {
    console.error('[error]', err.message);

    // The client only ever sees a safe, generic message. Details stay in the
    // server logs so we don't expose internals like SQL errors or file paths.
    res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
}

module.exports = errorHandler;
