-- Users Table (Stores Buyer, Admin, Investor)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gemstones Table (Stores physical details, reservation, and certification)
CREATE TABLE IF NOT EXISTS gemstones (
    id BIGSERIAL PRIMARY KEY,
    carat DECIMAL(10,3) NOT NULL,
    cut VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    certification_pdf_url VARCHAR(255),
    reservation_status VARCHAR(50) DEFAULT 'AVAILABLE',
    owner_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auctions Table (Stores auction details mapped to a gemstone)
CREATE TABLE IF NOT EXISTS auctions (
    id BIGSERIAL PRIMARY KEY,
    gemstone_id BIGINT NOT NULL UNIQUE REFERENCES gemstones(id),
    starting_price DECIMAL(15,2) NOT NULL,
    current_bid DECIMAL(15,2),
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids Table (Stores bidding history mapped to users and auctions)
CREATE TABLE IF NOT EXISTS bids (
    id BIGSERIAL PRIMARY KEY,
    auction_id BIGINT NOT NULL REFERENCES auctions(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    amount DECIMAL(15,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mining Plots Table (Stores geological stats and yields)
CREATE TABLE IF NOT EXISTS mining_plots (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    geological_data JSONB NOT NULL,
    yield_estimate DECIMAL(10,2),
    owner_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
