import { ZodError } from 'zod';
/**
 * Validate request body against a Zod schema
 * Returns 400 with detailed errors if validation fails
 */
export function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                const errors = err.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                res.status(400).json({
                    error: 'Validation failed',
                    details: errors,
                });
                return;
            }
            next(err);
        }
    };
}
/**
 * Global error handler middleware
 * Sanitizes error messages to prevent internal details from leaking
 */
export function globalErrorHandler(err, _req, res, _next) {
    const isDev = process.env.NODE_ENV === 'development';
    // Log full error in all environments
    console.error('[ERROR]', err);
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
    }
    if (err instanceof Error) {
        // Prisma known request error (constraint violation, not found, etc.)
        const message = err.message;
        // Handle common Prisma errors with friendly messages
        if (message.includes('Unique constraint')) {
            res.status(409).json({ error: 'A record with this information already exists.' });
            return;
        }
        if (message.includes('Record to update not found') || message.includes('Record to delete not found')) {
            res.status(404).json({ error: 'Resource not found.' });
            return;
        }
        if (message.includes('Foreign key constraint')) {
            res.status(400).json({ error: 'Invalid reference to a related resource.' });
            return;
        }
        // In development, expose the real error. In production, hide it.
        res.status(500).json({
            error: isDev ? message : 'An internal server error occurred. Please try again later.',
        });
        return;
    }
    res.status(500).json({ error: 'An unexpected error occurred.' });
}
