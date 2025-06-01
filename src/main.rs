use rand::Rng;
use chrono::Local;
use tokio;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get current time
    let current_time = Local::now();
    println!("Current time: {}", current_time.format("%Y-%m-%d %H:%M:%S"));
    
    // Generate a random number (updated to use the latest API)
    let random_number = rand::rng().random_range(1..=100);
    println!("Random number between 1 and 100: {}", random_number);
    
    // Make a simple HTTP request
    let response = reqwest::get("https://httpbin.org/ip").await?;
    let json: serde_json::Value = response.json().await?;
    println!("Your IP address: {}", json["origin"]);
    
    Ok(())
}
