-- Redis Caching Management System - Database Schema
-- Engine: MySQL 8+

-- properties holds the actual, permanent business data.
-- Redis never stores this permanently, it only caches copies of it.
CREATE TABLE properties (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    location        VARCHAR(150) NOT NULL,
    property_type   ENUM('apartment', 'house', 'villa', 'plot', 'commercial') NOT NULL,
    price           DECIMAL(12, 2) NOT NULL,
    bedrooms        SMALLINT UNSIGNED DEFAULT 0,
    bathrooms       SMALLINT UNSIGNED DEFAULT 0,
    area_sqft       INT UNSIGNED DEFAULT 0,
    status          ENUM('available', 'sold', 'rented') NOT NULL DEFAULT 'available',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_price_positive CHECK (price >= 0)
);

-- cache_activity_log is a persistent audit trail of what the Redis cache
-- layer did on every property request. This is what powers the
-- Activity / Logs page, and it is real recorded behaviour, not sample data.
CREATE TABLE cache_activity_log (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    cache_key       VARCHAR(255) NOT NULL,
    event_type      ENUM('HIT', 'MISS', 'SET', 'INVALIDATE') NOT NULL,
    property_id     INT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_property
        FOREIGN KEY (property_id) REFERENCES properties(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_activity_created_at ON cache_activity_log(created_at);
