import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.emailExists(email)) {
      return next(new AppError('E-mail já cadastrado.', 409));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    return created(res, { user, token }, 'Conta criada com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      return next(new AppError('Credenciais inválidas.', 401));
    }

    const token = generateToken(user.id);
    const { password: _pw, ...safeUser } = user;

    return ok(res, { user: safeUser, token }, 'Login realizado com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('Usuário não encontrado.', 404));
    return ok(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (await User.emailExists(email, req.user.id)) {
      return next(new AppError('E-mail já está em uso.', 409));
    }

    await User.updateProfile(req.user.id, { name, email });
    const updated = await User.findById(req.user.id);

    return ok(res, updated, 'Perfil atualizado com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { email } = await User.findById(req.user.id);
    const user = await User.findByEmail(email);

    if (!(await User.comparePassword(currentPassword, user.password))) {
      return next(new AppError('Senha atual incorreta.', 401));
    }

    await User.updatePassword(req.user.id, newPassword);
    return msgOk(res, 'Senha alterada com sucesso.');
  } catch (error) {
    next(error);
  }
};
