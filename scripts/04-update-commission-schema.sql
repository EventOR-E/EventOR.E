-- Add more detailed commission tracking
ALTER TABLE commission_payments 
ADD COLUMN IF NOT EXISTS transaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_commission_rate DECIMAL(5,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create a view for commission analytics
CREATE OR REPLACE VIEW commission_analytics AS
SELECT 
    DATE_TRUNC('month', p.created_at) as month,
    COUNT(*) as transaction_count,
    SUM(p.amount) as total_revenue,
    SUM(p.commission_amount) as total_commission,
    AVG(p.commission_rate) as average_rate,
    SUM(p.provider_amount) as total_provider_earnings
FROM payments p
WHERE p.status = 'completed'
GROUP BY DATE_TRUNC('month', p.created_at)
ORDER BY month DESC;

-- Create a function to calculate commission statistics
CREATE OR REPLACE FUNCTION get_commission_stats()
RETURNS TABLE (
    total_transactions BIGINT,
    total_commission NUMERIC,
    total_revenue NUMERIC,
    average_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_transactions,
        COALESCE(SUM(commission_amount), 0) as total_commission,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(AVG(commission_rate), 0) as average_rate
    FROM payments 
    WHERE status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update commission payments automatically
CREATE OR REPLACE FUNCTION update_commission_payment_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the latest commission payment record with new stats
    UPDATE commission_payments 
    SET 
        transaction_count = (
            SELECT COUNT(*) FROM payments 
            WHERE created_at BETWEEN period_start AND period_end 
            AND status = 'completed'
        ),
        average_commission_rate = (
            SELECT AVG(commission_rate) FROM payments 
            WHERE created_at BETWEEN period_start AND period_end 
            AND status = 'completed'
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT MAX(id) FROM commission_payments);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic commission tracking
DROP TRIGGER IF EXISTS trigger_update_commission_stats ON payments;
CREATE TRIGGER trigger_update_commission_stats
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_commission_payment_stats();
