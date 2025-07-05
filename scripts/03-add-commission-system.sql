-- Commission Settings Table
CREATE TABLE IF NOT EXISTS commission_settings (
    id SERIAL PRIMARY KEY,
    rate DECIMAL(5,4) NOT NULL DEFAULT 0.05, -- 5% default rate
    payment_method VARCHAR(50) NOT NULL DEFAULT 'mobile_money',
    account_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add commission fields to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.05,
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS provider_amount DECIMAL(10,2) DEFAULT 0;

-- Commission Payments Table (for tracking payouts to platform)
CREATE TABLE IF NOT EXISTS commission_payments (
    id SERIAL PRIMARY KEY,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    account_details TEXT NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    payment_date DATE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default commission settings
INSERT INTO commission_settings (rate, payment_method, account_details) 
VALUES (0.05, 'mobile_money', '0244123456')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_commission ON payments(commission_amount, created_at);
CREATE INDEX IF NOT EXISTS idx_commission_payments_period ON commission_payments(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_commission_settings_created ON commission_settings(created_at DESC);

-- Update existing payments to have commission data
UPDATE payments 
SET 
    commission_rate = 0.05,
    commission_amount = amount * 0.05,
    provider_amount = amount * 0.95
WHERE commission_rate IS NULL OR commission_rate = 0;
