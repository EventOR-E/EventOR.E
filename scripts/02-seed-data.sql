-- Insert service categories
INSERT INTO service_categories (name, description, icon) VALUES
('Photography', 'Professional photography services for events', 'camera'),
('Catering', 'Food and beverage services', 'utensils'),
('DJ & Music', 'Music and entertainment services', 'music'),
('Decoration', 'Event decoration and styling', 'palette'),
('Videography', 'Professional video recording services', 'video'),
('Venue', 'Event venues and locations', 'map-pin'),
('Planning', 'Full event planning services', 'calendar'),
('Transportation', 'Transportation and logistics', 'car');

-- Insert sample users (service seekers)
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified) VALUES
('akosua@example.com', '$2b$10$example_hash_1', 'Akosua', 'Mensah', '+233241234567', 'seeker', true),
('kofi@example.com', '$2b$10$example_hash_2', 'Kofi', 'Adjei', '+233241234568', 'seeker', true),
('ama@example.com', '$2b$10$example_hash_3', 'Ama', 'Osei', '+233241234569', 'seeker', true);

-- Insert sample provider users
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified) VALUES
('kwame@asantephoto.com', '$2b$10$example_hash_4', 'Kwame', 'Asante', '+233241234570', 'provider', true),
('afia@catering.com', '$2b$10$example_hash_5', 'Afia', 'Boateng', '+233241234571', 'provider', true),
('kobby@djentertainment.com', '$2b$10$example_hash_6', 'Kobby', 'Mensah', '+233241234572', 'provider', true),
('sarah@elegantdecor.com', '$2b$10$example_hash_7', 'Sarah', 'Owusu', '+233241234573', 'provider', true),
('akosua@eventplanning.com', '$2b$10$example_hash_8', 'Akosua', 'Darko', '+233241234574', 'provider', true),
('royal@videography.com', '$2b$10$example_hash_9', 'Royal', 'Asante', '+233241234575', 'provider', true);

-- Insert provider profiles
INSERT INTO provider_profiles (user_id, business_name, category, bio, location_city, location_region, years_experience, hourly_rate, daily_rate, verified) VALUES
(4, 'Kwame Asante Photography Studio', 'Photography', 'Professional wedding and event photographer with 8+ years of experience capturing life''s most precious moments across Ghana.', 'Accra', 'Greater Accra', 8, 100.00, 800.00, true),
(5, 'Afia''s Catering Services', 'Catering', 'Authentic Ghanaian cuisine and international dishes for all occasions. We specialize in traditional and modern catering.', 'Kumasi', 'Ashanti', 6, 45.00, 350.00, true),
(6, 'DJ Kobby Entertainment', 'DJ & Music', 'Professional DJ services with the latest Ghanaian and international hits. Perfect for weddings, parties, and corporate events.', 'Tema', 'Greater Accra', 5, 150.00, 1200.00, true),
(7, 'Elegant Events Decor', 'Decoration', 'Beautiful event decoration with traditional and modern Ghanaian themes. We transform spaces into magical experiences.', 'Cape Coast', 'Central', 4, 200.00, 1600.00, true),
(8, 'Akosua''s Event Planning', 'Planning', 'Full-service event planning for weddings, parties, and corporate events. We handle every detail so you can enjoy your special day.', 'Takoradi', 'Western', 7, 150.00, 1200.00, true),
(9, 'Royal Videography', 'Videography', 'Cinematic wedding and event videography capturing your special moments in stunning detail.', 'Tamale', 'Northern', 6, 120.00, 960.00, true);

-- Insert provider services
INSERT INTO provider_services (provider_id, category_id, service_name, description, price_min, price_max, duration) VALUES
(1, 1, 'Wedding Photography', 'Complete wedding day coverage including traditional ceremonies', 1500.00, 3000.00, '8-10 hours'),
(1, 1, 'Engagement Session', 'Pre-wedding photography session', 400.00, 600.00, '1-2 hours'),
(1, 1, 'Corporate Events', 'Professional corporate event photography', 200.00, 300.00, 'Per hour'),
(2, 2, 'Wedding Catering', 'Full wedding catering service', 2000.00, 5000.00, 'Full day'),
(2, 2, 'Corporate Lunch', 'Business meeting and conference catering', 500.00, 1500.00, 'Half day'),
(3, 3, 'Wedding DJ', 'Complete wedding entertainment package', 1000.00, 2000.00, '6-8 hours'),
(3, 3, 'Party DJ', 'Birthday and celebration DJ services', 600.00, 1200.00, '4-6 hours');

-- Insert sample reviews
INSERT INTO reviews (provider_id, client_id, rating, comment, event_type) VALUES
(1, 1, 5, 'Kwame was absolutely amazing! He captured our traditional wedding ceremony perfectly and made us feel so comfortable. The photos are stunning and we couldn''t be happier!', 'Traditional Wedding'),
(1, 2, 5, 'Professional, creative, and a joy to work with. Kwame went above and beyond for our corporate event in Accra. Highly recommend!', 'Corporate Event'),
(1, 3, 4, 'Great experience overall. Kwame was punctual and delivered beautiful photos of our naming ceremony. Would definitely book again!', 'Naming Ceremony'),
(2, 1, 5, 'Afia''s catering was exceptional! The traditional Ghanaian dishes were authentic and delicious. All our guests were impressed.', 'Wedding'),
(3, 2, 5, 'DJ Kobby kept the party going all night! Great music selection and professional setup. Highly recommended for any event.', 'Birthday Party');
