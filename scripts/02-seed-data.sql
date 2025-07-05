-- Insert service categories
INSERT INTO service_categories (name, description, icon) VALUES
('Photography', 'Professional photography services for events', 'camera'),
('Catering', 'Food and beverage services', 'utensils'),
('Music & DJ', 'Music and entertainment services', 'music'),
('Decoration', 'Event decoration and styling', 'palette'),
('Venue', 'Event venues and spaces', 'building'),
('Transportation', 'Transportation and logistics', 'car'),
('Security', 'Event security services', 'shield'),
('Cleaning', 'Post-event cleaning services', 'broom')
ON CONFLICT DO NOTHING;

-- Insert sample users (seekers)
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified) VALUES
('john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'John', 'Doe', '+233123456789', 'seeker', true),
('mary.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Mary', 'Smith', '+233987654321', 'seeker', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample users (providers)
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified) VALUES
('sarah.photo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sarah', 'Johnson', '+233555123456', 'provider', true),
('mike.catering@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Mike', 'Wilson', '+233555789012', 'provider', true),
('dj.alex@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Alex', 'Brown', '+233555345678', 'provider', true)
ON CONFLICT (email) DO NOTHING;

-- Insert provider profiles
INSERT INTO provider_profiles (user_id, business_name, category, description, location_city, location_region, years_experience, hourly_rate, rating, total_reviews, verified) VALUES
((SELECT id FROM users WHERE email = 'sarah.photo@example.com'), 'Sarah Johnson Photography', 'Photography', 'Professional wedding and event photographer with 8 years of experience', 'Accra', 'Greater Accra', 8, 150.00, 4.8, 45, true),
((SELECT id FROM users WHERE email = 'mike.catering@example.com'), 'Mike''s Catering Services', 'Catering', 'Full-service catering for weddings, corporate events, and private parties', 'Kumasi', 'Ashanti', 12, 80.00, 4.6, 32, true),
((SELECT id FROM users WHERE email = 'dj.alex@example.com'), 'DJ Alex Entertainment', 'Music & DJ', 'Professional DJ services for all types of events with modern sound equipment', 'Accra', 'Greater Accra', 5, 120.00, 4.9, 28, true)
ON CONFLICT DO NOTHING;

-- Insert provider services
INSERT INTO provider_services (provider_id, name, description, price, duration_hours) VALUES
((SELECT id FROM provider_profiles WHERE business_name = 'Sarah Johnson Photography'), 'Wedding Photography Package', 'Complete wedding photography with 300+ edited photos', 1200.00, 8),
((SELECT id FROM provider_profiles WHERE business_name = 'Sarah Johnson Photography'), 'Event Photography', 'Professional event photography for corporate and private events', 800.00, 4),
((SELECT id FROM provider_profiles WHERE business_name = 'Mike''s Catering Services'), 'Wedding Catering', 'Full wedding catering service including appetizers, main course, and dessert', 2500.00, 6),
((SELECT id FROM provider_profiles WHERE business_name = 'Mike''s Catering Services'), 'Corporate Event Catering', 'Professional catering for corporate events and meetings', 1500.00, 4),
((SELECT id FROM provider_profiles WHERE business_name = 'DJ Alex Entertainment'), 'Wedding DJ Package', 'Complete DJ service with sound system and lighting for weddings', 1000.00, 8),
((SELECT id FROM provider_profiles WHERE business_name = 'DJ Alex Entertainment'), 'Party DJ Service', 'DJ service for birthday parties and private events', 600.00, 4)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (provider_id, user_id, rating, comment) VALUES
((SELECT id FROM provider_profiles WHERE business_name = 'Sarah Johnson Photography'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), 5, 'Sarah did an amazing job at our wedding! The photos are absolutely beautiful and she captured every special moment.'),
((SELECT id FROM provider_profiles WHERE business_name = 'Mike''s Catering Services'), (SELECT id FROM users WHERE email = 'mary.smith@example.com'), 4, 'Great food and professional service. Our guests loved the menu and everything was perfectly organized.'),
((SELECT id FROM provider_profiles WHERE business_name = 'DJ Alex Entertainment'), (SELECT id FROM users WHERE email = 'john.doe@example.com'), 5, 'Alex kept the party going all night! Great music selection and very professional setup.')
ON CONFLICT DO NOTHING;
