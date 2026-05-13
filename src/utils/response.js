export const ok = (res, data = null, message = null) => {
  const body = { success: true };
  if (message !== null) body.message = message;
  if (data !== null) body.data = data;
  return res.json(body);
};

export const created = (res, data, message = 'Criado com sucesso.') =>
  res.status(201).json({ success: true, message, data });

export const msgOk = (res, message) =>
  res.json({ success: true, message });
