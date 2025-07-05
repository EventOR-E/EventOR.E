-- Ensure all commission-related columns exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.10,
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS provider_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS commission_status VARCHAR(20) DEFAULT 'pending';

-- Update existing bookings to have commission data
UPDATE bookings 
SET 
    commission_rate = 0.10,
    commission_amount = total_amount * 0.10,
    provider_amount = total_amount * 0.90,
    commission_status = 'pending'
WHERE commission_rate IS NULL AND total_amount IS NOT NULL;

-- Insert default commission settings if none exist
INSERT INTO commission_settings (commission_rate, payment_method, payment_account_name)
SELECT 0.10, 'mobile_money', 'EventOR Platform'
WHERE NOT EXISTS (SELECT 1 FROM commission_settings);
