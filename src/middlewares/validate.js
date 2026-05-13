export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.slice(1).join('.') || e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos.',
      errors,
    });
  }

  const { body, params, query } = result.data;
  if (body !== undefined) req.body = body;
  if (params !== undefined) req.params = params;
  if (query !== undefined) req.query = query;

  next();
};
