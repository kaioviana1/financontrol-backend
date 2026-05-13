-- ============================================================
--  CONTROLE FINANCEIRO — Schema completo
--  Execute este arquivo no banco de dados "finan"
-- ============================================================

CREATE DATABASE IF NOT EXISTS finan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finan;

-- ------------------------------------------------------------
-- Usuários
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Categorias (user_id NULL = categoria padrão do sistema)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  user_id     INT           NULL,
  name        VARCHAR(100)  NOT NULL,
  type        ENUM('income','expense') NOT NULL,
  color       VARCHAR(7)    DEFAULT '#6366f1',
  icon        VARCHAR(50)   DEFAULT 'tag',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Transações
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id            INT             AUTO_INCREMENT PRIMARY KEY,
  user_id       INT             NOT NULL,
  category_id   INT             NULL,
  description   VARCHAR(200)    NOT NULL,
  amount        DECIMAL(10,2)   NOT NULL,
  type          ENUM('income','expense') NOT NULL,
  date          DATE            NOT NULL,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Metas financeiras
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
  id              INT             AUTO_INCREMENT PRIMARY KEY,
  user_id         INT             NOT NULL,
  title           VARCHAR(150)    NOT NULL,
  target_amount   DECIMAL(10,2)   NOT NULL,
  current_amount  DECIMAL(10,2)   DEFAULT 0.00,
  deadline        DATE            NULL,
  created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Cartões de crédito
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cards (
  id            INT             AUTO_INCREMENT PRIMARY KEY,
  user_id       INT             NOT NULL,
  name          VARCHAR(100)    NOT NULL,
  last_digits   CHAR(4)         NULL,
  brand         ENUM('visa','mastercard','elo','amex','hipercard','outros') DEFAULT 'outros',
  limit_amount  DECIMAL(10,2)   NOT NULL,
  closing_day   TINYINT UNSIGNED NOT NULL COMMENT 'Dia do fechamento (1-31)',
  due_day       TINYINT UNSIGNED NOT NULL COMMENT 'Dia do vencimento (1-31)',
  color         VARCHAR(7)      DEFAULT '#6366f1',
  is_active     TINYINT(1)      DEFAULT 1,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Parcelamentos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS installments (
  id                  INT             AUTO_INCREMENT PRIMARY KEY,
  user_id             INT             NOT NULL,
  card_id             INT             NOT NULL,
  description         VARCHAR(200)    NOT NULL,
  total_amount        DECIMAL(10,2)   NOT NULL,
  installment_count   TINYINT UNSIGNED NOT NULL COMMENT 'Total de parcelas',
  installment_value   DECIMAL(10,2)   NOT NULL COMMENT 'Valor de cada parcela',
  start_date          DATE            NOT NULL COMMENT 'Mês/ano da 1ª parcela',
  paid_count          TINYINT UNSIGNED DEFAULT 0 COMMENT 'Parcelas já pagas',
  created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Categorias padrão do sistema
-- ------------------------------------------------------------
INSERT IGNORE INTO categories (user_id, name, type, color, icon) VALUES
  (NULL, 'Salário',       'income',  '#22c55e', '💰'),
  (NULL, 'Freelance',     'income',  '#10b981', '💼'),
  (NULL, 'Investimentos', 'income',  '#3b82f6', '📈'),
  (NULL, 'Outros',        'income',  '#8b5cf6', '🤝'),
  (NULL, 'Alimentação',   'expense', '#ef4444', '🍕'),
  (NULL, 'Aluguel',       'expense', '#f97316', '🏠'),
  (NULL, 'Transporte',    'expense', '#f59e0b', '🚗'),
  (NULL, 'Saúde',         'expense', '#06b6d4', '💊'),
  (NULL, 'Lazer',         'expense', '#ec4899', '🎬'),
  (NULL, 'Estudos',       'expense', '#6366f1', '📚'),
  (NULL, 'Assinaturas',   'expense', '#84cc16', '📱'),
  (NULL, 'Compras',       'expense', '#14b8a6', '🛒'),
  (NULL, 'Internet',      'expense', '#a855f7', '💡'),
  (NULL, 'Casa',          'expense', '#78716c', '🏋️');
