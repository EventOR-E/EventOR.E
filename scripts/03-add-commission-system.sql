-- Add commission settings table
CREATE TABLE IF NOT EXISTS commission_settings (
    id SERIAL PRIMARY KEY,
    commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.10, -- 10% default
    payment_method VARCHAR(50) NOT NULL DEFAULT 'mobile_money',
    payment_account_momo VARCHAR(20),
    momo_network VARCHAR(20),
    bank_name VARCHAR(100),
    payment_account_bank VARCHAR(50),
    payment_account_name VARCHAR(100) NOT NULL DEFAULT 'EventOR Platform',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add commission payments tracking table
CREATE TABLE IF NOT EXISTS commission_payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    commission_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add commission fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS provider_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS commission_status VARCHAR(20) DEFAULT 'pending';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_commission_payments_booking_id ON commission_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_commission_status ON bookings(commission_status);
